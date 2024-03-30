const queryMysql = require("../../database/mysql.js");
class UserController {
  async getAllUser(req, res) {
    const users = await queryMysql(`SELECT * FROM nguoi_dung`);
    res.json(users);
  }
  async deleteUser(req, res) {
    try {
      const id = req.query.ND_id;
      console.log(id);
      await queryMysql(`DELETE FROM NGUOI_DUNG WHERE ND_id = ${id}`);
      res.json("DELETED USER");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new UserController();
