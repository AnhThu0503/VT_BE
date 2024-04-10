const queryMysql = require("../../database/mysql.js");
const cloudinary = require("../../service/cloundinary.js");

class BlogController {
  async createBlog(req, res) {
    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Get current date/time in MySQL format

      // Insert into BLOG table
      const create_blog = await queryMysql(`
        INSERT INTO BLOG (B_tieuDe, B_noiDung, B_ngayTao, DMSP_id)
        VALUES ('${req.body.B_tieuDe}', '${req.body.value}', '${currentDate}', ${req.body.id_category_selected})
      `);

      // Insert images into HINHANHBLOG table
      for (let base64 of req.body.file_images) {
        const response = await cloudinary.uploader.upload(base64);
        await queryMysql(`
          INSERT INTO HINHANHBLOG (B_id, HAB_URL)
          VALUES (${create_blog.insertId}, '${response.url}')
        `);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog" });
    }
  }

  async uploadImage(req, res) {
    try {
      const file = req.file;
      console.log(req);
      const response = await cloudinary.uploader.upload(file);

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllBlog(req, res) {
    try {
      const blogs = await queryMysql(`SELECT * FROM BLOG`);

      for (let i = 0; i < blogs.length; i++) {
        let blog = blogs[i];

        // Retrieve images for the current blog post
        let images = await queryMysql(
          `SELECT HAB_URL FROM HINHANHBLOG WHERE B_id=${blog.B_id}`
        );
        // Attach the first image URL to the blog object
        blog.image = images.length > 0 ? images[0].HAB_URL : "";

        // Retrieve categories for the current blog post
        let category = await queryMysql(
          `SELECT * FROM DANHMUCSANPHAM WHERE DMSP_id = ${blog.DMSP_id}`
        );
        blog.category = category.length > 0 ? category[0] : null;
      }

      // Send the response with the retrieved blog data
      res.json(blogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async deleteBlog(req, res) {
    try {
      const id = req.query.B_id;
      await queryMysql(`
      DELETE FROM BLOG
      WHERE B_id = ${id}
    `);

      await queryMysql(`
      DELETE FROM HINHANHBLOG
      WHERE B_id = ${id}
    `);
      res.json("Xoa thanh cong");
    } catch (error) {
      console.log(error);
    }
  }
  async getBlog(req, res) {
    try {
      const blogs = await queryMysql(
        `SELECT * FROM BLOG WHERE B_id = ${req.body.B_id}`
      );
      let blogs_images = await queryMysql(
        `SELECT HAB_URL,HAB_id FROM HINHANHBLOG WHERE B_id=${blogs[0].B_id}`
      );
      blogs[0].image = blogs_images.length > 0 ? blogs_images[0].HAB_URL : "";
      blogs[0].ID = blogs_images.length > 0 ? blogs_images[0].HAB_id : "";

      res.json({
        blog: blogs[0],
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateBlog(req, res) {
    try {
      const id = req.body.B_id;

      // Update BLOG table
      await queryMysql(`
        UPDATE BLOG
        SET 
          B_tieuDe = '${req.body.B_tieuDe}',
          B_noiDung = '${req.body.B_noiDung}',
          DMSP_id = ${req.body.id_category_selected}
        WHERE B_id = ${id}
      `);

      // Check if req.body.file_images is provided
      if (
        req.body.file_images &&
        req.body.file_images.length > 0 &&
        req.body.file_images !== req.body.filelist
      ) {
        const HAB_id = req.body.HAB_id;
        for (let base64 of req.body.file_images) {
          const response = await cloudinary.uploader.upload(base64);
          // Update HINHANHBLOG with the new image URL
          await queryMysql(
            `UPDATE HINHANHBLOG SET HAB_URL='${response.url}' WHERE HAB_id=${HAB_id}`
          );
        }
      }

      res.json("update success");
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: "Failed to update discount" });
    }
  }
}

module.exports = new BlogController();
