const queryMysql = require("../../database/mysql.js");
const bcrypt = require("bcrypt");
var privateKey = "anhthu";
var jwt = require("jsonwebtoken");
const saltRounds = 10;
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
  async createUser(req, res) {
    let hash = await bcrypt.hash(req.body.ND_matKhau, saltRounds);
    let users = await queryMysql(
      `select ND_email from NGUOI_DUNG where ND_email='${req.body.ND_email}'`
    );
    if (users.length === 0) {
      let create_user =
        await queryMysql(`insert into NGUOI_DUNG(ND_ten,ND_email,ND_matKhau,ND_gioiTinh,ND_SDT,ND_diaChi)value(
                  '${req.body.ND_ten}',
                  '${req.body.ND_email}',
                  '${hash}',
                  ${req.body.ND_gioiTinh},
                  '${req.body.ND_SDT}',
                  '${req.body.ND_diaChi}'

              )`);
      res.json({ success: true, message: "Thành công" });
    } else {
      res.json({ success: false, message: "Email đã tồn tại" });
    }
  }
  async handleLogin(req, res) {
    try {
      const user = req.body;
      console.log("user", user);
      const users = await queryMysql(
        `select ND_id, ND_matkhau from nguoi_dung where ND_email='${user.email}' AND ND_email='Admin@gmail.com'`
      );
      console.log("users", users);

      if (users.length === 1) {
        if (user.password == users[0].ND_matkhau) {
          const token = await jwt.sign({ ND_id: users[0].ND_id }, privateKey);

          res.json({ success: true, token });
        } else {
          res.json({ success: false, message: "Mật khẩu không đúng" });
        }
      } else {
        res.json({ success: false, message: "Email chưa đăng ký" });
      }
    } catch (e) {
      console.error(e);
    }
  }
  async authenUser(req, res) {
    try {
      var userVerify = await jwt.verify(req.query.token, privateKey);
      const users = await queryMysql(
        `select ND_id, ND_email, ND_ten,ND_SDT, ND_diaChi from nguoi_dung where ND_id=${userVerify.ND_id}`
      );
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new UserController();
