const queryMysql = require("../../database/mysql.js");
const cloudinary = require("../../service/cloundinary.js");

class BlogController {
  async createBlog(req, res) {
    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Get current date/time in MySQL format
      console.log("response", req.body);
      const create_blog =
        await queryMysql(`insert into BLOG(B_tieuDe,B_noiDung,B_ngayTao,DMSP_id)value(
                '${req.body.B_tieuDe}',
                '${req.body.value}',
                '${currentDate}',
                ${req.body.id_category_selected}
            )`);
      for (let base64 of req.body.file_images) {
        const response = await cloudinary.uploader.upload(base64);
        let result = await queryMysql(
          `insert into HINHANHBLOG(B_id,HAB_URL)value(${create_blog.insertId},'${response.url}')`
        );
      }
      res.json(true);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new BlogController();
