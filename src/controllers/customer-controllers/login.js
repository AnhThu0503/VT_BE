var jwt = require("jsonwebtoken");
var privateKey = "anhthu";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const queryMysql = require("../../database/mysql.js");

class LoginController {
  async handleLogin(req, res) {
    try {
      const user = req.body;
      const users = await queryMysql(
        `select ND_id, ND_matkhau from nguoi_dung where ND_email='${user.email}'`
      );
      if (users.length === 1) {
        const compare = await bcrypt.compare(
          user.password,
          users[0].ND_matkhau
        );
        if (compare) {
          const token = await jwt.sign({ ND_id: users[0].ND_id }, privateKey);
          const count_cart = await queryMysql(
            `select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`
          );
          if (count_cart[0].value === 0) {
            const create_cart = await queryMysql(
              `insert into giohang(ND_id)value(${users[0].ND_id})`
            );
          }
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

  async handleLoginWithGoogle(req, res) {
    try {
      // const profile = ;
      // console.log(" req.body", req.body);
      let user = req.body.profile;
      // console.log("user", user);
      const users = await queryMysql(
        `select ND_id from nguoi_dung where ND_email='${user.email}'`
      );
      if (users.length === 1) {
        // console.log("run 1");
        const token = await jwt.sign({ ND_id: users[0].ND_id }, privateKey);
        const count_cart = await queryMysql(
          `select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`
        );
        if (count_cart[0].value === 0) {
          const create_cart = await queryMysql(
            `insert into giohang(ND_id)value(${users[0].ND_id})`
          );
        }
        res.json({ success: true, token });
      } else {
        let create_user =
          await queryMysql(`insert into NGUOI_DUNG(ND_ten,ND_AnhDaiDien,ND_email)values(
                    '${user.name}',
                    '${user.picture}',
                    '${user.email}'
                )`);
        const users = await queryMysql(
          `select ND_id from nguoi_dung where ND_email='${user.email}'`
        );
        if (users[0] && users[0].ND_id !== null) {
          const token = await jwt.sign({ ND_id: users[0].ND_id }, privateKey);
          const count_cart = await queryMysql(
            `select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`
          );
          // console.log("count_cart", count_cart);
          if (count_cart[0].value === 0) {
            const create_cart = await queryMysql(
              `insert into giohang(ND_id)value(${users[0].ND_id})`
            );
            console.log("create_cart", create_cart);
          }
          res.json({ success: true, token });
        } else {
          res.json({ success: false, message: " thất bại" });
        }
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
      const count_cart = await queryMysql(
        `select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`
      );
      let numberProductToCart = 0;
      numberProductToCart = await queryMysql(
        `select sum(soLuong) as sum from sp_giohang, giohang where giohang.GH_id=sp_giohang.GH_id and ND_id=${users[0].ND_id}`
      );
      console.log("remove_item", users[0].ND_id, numberProductToCart);
      if (count_cart[0].value === 0) {
        const create_cart = await queryMysql(
          `insert into giohang(ND_id)value(${users[0].ND_id})`
        );
      }
      //  users: users[0], numberProductToCart
      if (users.length === 1) {
        res.json({
          user: users,
          numberProductToCart: numberProductToCart[0],
        });
      } else {
        res.json(false);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new LoginController();
