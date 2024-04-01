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
  async updateCustomer(req, res) {
    try {
      const id = req.body.ND_id;
      const { ND_ten, ND_email, ND_SDT, ND_diaChi } = req.body; // Destructure req.body for readability
      // Assuming 'queryMysql' is a function that executes SQL queries asynchronously
      const user = await queryMysql(`
        UPDATE NGUOI_DUNG
        SET 
          ND_ten = '${ND_ten}',
          ND_email = '${ND_email}',
          ND_SDT = '${ND_SDT}',
          ND_diaChi = '${ND_diaChi}'
        WHERE ND_id = ${id}
      `);

      res.json("update nguoi_dung success");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update nguoi_dung" });
    }
  }

  async countUser(req, res) {
    try {
      // Assuming queryMysql is a function that executes MySQL queries asynchronously
      const result = await queryMysql(
        `SELECT COUNT(ND_id) AS SoNguoiDung FROM NGUOI_DUNG;`
      );

      // Assuming queryMysql returns an array of rows, we extract the first row
      const numUsers = result[0].SoNguoiDung;

      // Sending the response back
      res.status(200).json({ numUsers });
    } catch (error) {
      // Handling errors
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getUser(req, res) {
    try {
      const user = await queryMysql(`SELECT *
        FROM NGUOI_DUNG
        WHERE ND_id = ${req.body.ND_id}`);
      res.json({ user });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new UserController();
