var jwt = require('jsonwebtoken');
var privateKey = 'anhthu';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const queryMysql = require('../../database/mysql.js')

class LoginController {
    async handleLogin(req, res) {
        try {

            const user = req.body
            const users = await queryMysql(`select ND_id, ND_matkhau from nguoi_dung where ND_email='${user.email}'`)
            if (users.length === 1) {
                const compare = await bcrypt.compare(user.password, users[0].ND_matkhau);
                if (compare) {
                    const token = await jwt.sign({ ND_id: users[0].ND_id }, privateKey)
                    const count_cart = await queryMysql(`select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`)
                    if (count_cart[0].value === 0) {
                        const create_cart = await queryMysql(`insert into giohang(ND_id)value(${users[0].ND_id})`)
                    }
                    res.json({ success: true, token })
                } else {
                    res.json({ success: false, message: 'Mật khẩu không đúng' })
                }
            } else {
                res.json({ success: false, message: 'Email chưa đăng ký' })
            }
        } catch (e) {
            console.error(e)
        }
    }

    async authenUser(req, res) {
        try {
            var userVerify = await jwt.verify(req.query.token, privateKey)
            const users = await queryMysql(`select ND_id, ND_email, ND_ten from nguoi_dung where ND_id=${userVerify.ND_id}`)
            const count_cart = await queryMysql(`select count(GH_id) as value from giohang where ND_id=${users[0].ND_id}`)
            if (count_cart[0].value === 0) {
                const create_cart = await queryMysql(`insert into giohang(ND_id)value(${users[0].ND_id})`)
            }
            if (users.length === 1) {
                res.json(users[0])
            } else {
                res.json(false)
            }
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = new LoginController