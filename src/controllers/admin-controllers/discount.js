const queryMysql = require("../../database/mysql.js");
class DiscountController {
  async getAllDiscount(req, res) {
    try {
      const discounts = await queryMysql(
        `SELECT * FROM soctrangspecial.khuyenmai as km
            inner join soctrangspecial.sanpham as sp on sp.SP_id=km.SP_id`
      );
      res.json(discounts);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new DiscountController();
