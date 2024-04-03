const queryMysql = require("../../database/mysql.js");

class BlogController {
  async getAllBlog(req, res) {
    try {
      const blogs = await queryMysql(`select * from BLOG`);
      res.json(blogs);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new BlogController();
