const queryMysql = require('../../database/mysql.js')

class CategoryController {
    async getCategoryAndSupplier(req, res) {
        try {
            const categorys = await queryMysql(`select * from danhmucsanpham`)
            const suppliers = await queryMysql(`select * from nhacungcap`)
            res.json({ categorys, suppliers })
        } catch (e) {
            console.error(e)
        }
    }

    async getAllCategory(req, res) {
        const categorys = await queryMysql(`select * from danhmucsanpham `)
        res.json(categorys)
    }

}

module.exports = new CategoryController