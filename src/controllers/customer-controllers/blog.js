const queryMysql = require("../../database/mysql.js");

class BlogController {
  async getAllBlog(req, res) {
    try {
      const blogs = await queryMysql(`select * from BLOG`);
      const length = blogs.length;
      for (let i = 0; i < length; i++) {
        let blog = blogs[i];

        let images = await queryMysql(
          `SELECT HAB_URL FROM HINHANHBLOG WHERE B_id=${blog.B_id}`
        );
        blog.image = images.length > 0 ? images[0].HAB_URL : "";
      }

      res.json(blogs);
    } catch (e) {
      console.error(e);
    }
  }

  async getRecentBlog(req, res) {
    try {
      const recent_blogs =
        await queryMysql(`SELECT B_id, B_tieuDe, B_ngayTao, DMSP_id
      FROM BLOG
      ORDER BY B_ngayTao DESC
      LIMIT 2;`);
      const length = recent_blogs.length;
      for (let i = 0; i < length; i++) {
        let blog = recent_blogs[i];

        let images = await queryMysql(
          `SELECT HAB_URL FROM HINHANHBLOG WHERE B_id=${blog.B_id}`
        );
        blog.image = images.length > 0 ? images[0].HAB_URL : "";
      }
      res.json(recent_blogs);
    } catch (e) {
      console.error(e);
    }
  }
  async getBlog(req, res) {
    try {
      let blogs = await queryMysql(
        `SELECT * FROM BLOG WHERE B_id=${req.query.B_id}`
      );
      if (blogs.length === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }
      let categorys = await queryMysql(
        `select * from SANPHAM where DMSP_id=${blogs[0].DMSP_id}`
      );
      for (let product of categorys) {
        let images = await queryMysql(
          `select HA_URL from hinhanh where SP_id=${product.SP_id}`
        );
        let prices = await queryMysql(
          `select * from gia where SP_id=${product.SP_id}`
        );
        product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";
        let product_discount = await queryMysql(
          `select * from khuyenmai where CURDATE() BETWEEN KM_ngayBatDau and KM_ngayKetThuc and SP_id=${product.SP_id}`
        );
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;
      }

      let blogs_images = await queryMysql(
        `SELECT HAB_URL FROM HINHANHBLOG WHERE B_id=${blogs[0].B_id}`
      );
      blogs[0].blogs_images = blogs_images.reverse();

      res.json({
        blog: blogs[0],
        categorys: categorys,
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postComment(req, res) {
    try {
      const { ND_id, B_id, BLB_noiDung, BLB_ngayBL } = req.body;
      const createTableQuery = `
      INSERT INTO BINHLUANBLOG (ND_id, B_id, BLB_noiDung, BLB_ngayBL)
      VALUES (${ND_id}, ${B_id}, '${BLB_noiDung}', '${BLB_ngayBL}')`;

      const data = await queryMysql(createTableQuery);
      console.log("BINHLUANBLOG table created successfully");
      res.status(200).json(data);
    } catch (error) {
      console.error("Error creating BINHLUANBLOG table:", error);
    }
  }

  async postCommentReply(req, res) {
    try {
      const { ND_id, BLB_id, BLB_noiDung, BLB_ngayBL } = req.body;
      const createTableQuery = `INSERT INTO TRALOIBLB (ND_id, BLB_id, TLBLB_noiDung, TLBLB_ngayBL) VALUES (${ND_id}, ${BLB_id}, '${BLB_noiDung}', '${BLB_ngayBL}')`;

      const data = await queryMysql(createTableQuery);

      res.status(200).json(data);
    } catch (error) {
      console.error("Error creating BINHLUANBLOG table:", error);
    }
  }

  async getAllComments(req, res) {
    try {
      const id = req.query.B_id;

      const comments = await queryMysql(
        `SELECT 
                BLB_id,
                BLB_ngayBL,
                BLB_noiDung,
                BLB.ND_id,
                BLB.B_id,
                ND.ND_SDT,
                ND.ND_diaChi,
                ND.ND_email,
                ND.ND_gioiTinh,
                ND.ND_matKhau,
                ND.ND_ten
            FROM 
                BINHLUANBLOG AS BLB
            JOIN 
                NGUOI_DUNG AS ND ON BLB.ND_id = ND.ND_id
            WHERE 
                BLB.B_id = ${id}`
      );

      // Iterate over comments and fetch their replies
      for (let comment of comments) {
        let commentReplys = await queryMysql(
          `SELECT 
                    TLBLB_id,
                    TLBLB_ngayBL,
                    TLBLB_noiDung,
                    TLBLB.ND_id,
                    TLBLB.BLB_id,
                    ND.ND_SDT,
                    ND.ND_diaChi,
                    ND.ND_email,
                    ND.ND_gioiTinh,
                    ND.ND_matKhau,
                    ND.ND_ten
                FROM 
                    TRALOIBLB AS TLBLB
                JOIN 
                    NGUOI_DUNG AS ND ON TLBLB.ND_id = ND.ND_id
                WHERE 
                    TLBLB.BLB_id = ${comment.BLB_id}`
        );
        // Assign replies to comment
        comment.replies = commentReplys;
        console.log("    comment.replies", comment.replies);
      }

      res.json(comments);
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new BlogController();
