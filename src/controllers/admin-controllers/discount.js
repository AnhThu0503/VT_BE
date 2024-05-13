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
  async getDiscount(req, res) {
    try {
      const discount = await queryMysql(`SELECT *
        FROM KHUYENMAI
        WHERE KM_id = ${req.body.KM_id}`);
      res.json({ discount });
    } catch (error) {
      console.log(error);
    }
  }
  async createDiscount(req, res) {
    try {
      const create_discount =
        await queryMysql(`insert into KHUYENMAI(SP_id,KM_noiDung,KM_ngayBatDau,KM_ngayKetThuc,KM_mucGiamGia) values(
              ${req.body.id_product_selected},
              '${req.body.KM_noiDung}',
              '${req.body.KM_ngayBatDau}',
              '${req.body.KM_ngayKetThuc}',
              ${req.body.KM_mucGiamGia}
          )`);
      res.json(true);
    } catch (e) {
      console.error(e);
    }
  }
  async deleteDiscount(req, res) {
    try {
      const id = req.query.KM_id;
      console.log(id);
      await queryMysql(`
      DELETE FROM KHUYENMAI
      WHERE KM_id = ${id}
    `);

      res.json("Xoa thanh cong");
    } catch (error) {
      console.log(error);
    }
  }
  async updateDiscount(req, res) {
    try {
      const id = req.body.KM_id;
      const update_discount = await queryMysql(`
      UPDATE KHUYENMAI
        SET 
          KM_noiDung = '${req.body.KM_noiDung}',
          SP_id = ${req.body.id_product_selected},
         
          KM_mucGiamGia = ${req.body.KM_mucGiamGia}
        WHERE KM_id = ${id}`);
      res.json("update success");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update discount" });
    }
  }
}

module.exports = new DiscountController();
