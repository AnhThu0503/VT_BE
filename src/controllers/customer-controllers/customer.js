const queryMysql = require('../../database/mysql.js')

class CustomerController {
    async getCustomerInfo(req, res) {
        try {
            if (req.query?.ND_id) {
                const customers = await queryMysql(`select ND_id, ND_email, ND_ten, ND_gioitinh, ND_SDT, ND_diaChi from nguoi_dung where ND_id=${req.query.ND_id}`)
                res.json(customers.length === 1 ? customers[0]:null)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

    async updateAddress(req, res){
        try {
            if (req.body?.address) {
                const update_address = await queryMysql(`update nguoi_dung set ND_diaChi='${req.body.address}' where ND_id=${req.body.ND_id}`)
                res.json(update_address.affectedRows > 0 ? true:false)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

    async updateCustomer(req, res){
        try {
            if (req.body?.ND_id && req.body?.name && req.body?.phone) {
                const update_customer = await queryMysql(`update nguoi_dung set 
                    ND_ten='${req.body.name}',
                    ND_SDT='${req.body.phone}'
                    where ND_id=${req.body.ND_id}
                `)
                res.json(update_customer.affectedRows > 0 ? true:false)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = new CustomerController