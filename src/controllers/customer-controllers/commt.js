const queryMysql = require("../../database/mysql.js");

class CommentController {
  async comment(req, res) {
    try {
      let productID = req.body.SP_id;
      const orders = await queryMysql(
        `SELECT * FROM DONHANG WHERE ND_id = ${req.body.ND_id}`
      );
      let NDid = req.body.ND_id;

      let success = false; // Flag to track if at least one comment was successfully created

      for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        console.log("order.DH_id", order.DH_id);
        const orderDetails = await queryMysql(
          `SELECT * FROM CHI_TIET_DH WHERE DH_id = ${order.DH_id}`
        );

        for (let j = 0; j < orderDetails.length; j++) {
          let orderDetail = orderDetails[j];
          let spid = orderDetail.SP_id;
          console.log("spid - productid", spid, productID);
          if (spid == productID) {
            console.log("Đã mua");
            await queryMysql(`
              INSERT INTO DANHGIASP (ND_id, SP_id, DGSP_soSao, DGSP_noiDung, DGSP_ngayDanhGia)
              VALUES (${req.body.ND_id}, ${req.body.SP_id}, ${req.body.sosao}, '${req.body.noidung}', CURDATE())
            `);
            success = true; // Set flag to true if at least one comment was created
            break; // Exit the inner loop once a comment is inserted
          }
        }
        if (success) {
          break; // Exit the outer loop once a comment is inserted
        }
      }

      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Error creating comment" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getComments(req, res) {
    try {
      const id = req.query.SP_id;

      const comments = await queryMysql(`
            SELECT 
                danhgia.DGSP_id,
                danhgia.DGSP_ngayDanhGia,
                danhgia.DGSP_noiDung,
                danhgia.DGSP_soSao,
                danhgia.ND_id,
                danhgia.SP_id,
                nguoidung.ND_SDT,
                nguoidung.ND_diaChi,
                nguoidung.ND_email,
                nguoidung.ND_gioiTinh,
                nguoidung.ND_matKhau,
                nguoidung.ND_ten
            FROM 
                DANHGIASP AS danhgia
            JOIN 
                NGUOI_DUNG AS nguoidung ON danhgia.ND_id = nguoidung.ND_id
            WHERE 
                danhgia.SP_id = ${id}
        `);

      let totalRating = 0;
      for (let i = 0; i < comments.length; i++) {
        totalRating += comments[i].DGSP_soSao;
      }
      const averageRating =
        comments.length > 0 ? totalRating / comments.length : 0;
      console.log("averageRating", averageRating);
      res.json({ comments, averageRating });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new CommentController();
