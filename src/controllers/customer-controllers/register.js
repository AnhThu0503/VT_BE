const queryMysql = require("../../database/mysql.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class RegisterController {
  async createUser(req, res) {
    try {
      let user = req.body;
      let hash = await bcrypt.hash(user.password, saltRounds);
      let users = await queryMysql(
        `select ND_email from NGUOI_DUNG where ND_email='${user.email}'`
      );
      if (users.length === 0) {
        let create_user =
          await queryMysql(`insert into NGUOI_DUNG(ND_ten,ND_email,ND_matKhau,ND_gioiTinh,ND_SDT)value(
                    '${user.name}',
                    '${user.email}',
                    '${hash}',
                    ${user.sex},
                    '${user.phone}'
                )`);
        res.json({ success: true, message: "Thành công" });
      } else {
        res.json({ success: false, message: "Email đã tồn tại" });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new RegisterController();
