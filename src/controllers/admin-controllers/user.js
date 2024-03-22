const queryMysql = require('../../database/mysql.js')
class UserController {
    async getAllUser(req, res) {
        const users = await queryMysql(`SELECT * FROM nguoi_dung`)
        res.json(users)
    }
}
module.exports = new UserController