const queryMysql = require("../../database/mysql.js");
class SupplierController {
  async getAllSupplier(req, res) {
    const suppliers = await queryMysql(`select * from nhacungcap `);
    res.json(suppliers);
  }
  async uploadSupplier(req, res) {
    try {
      const supplier = await queryMysql(
        `insert into NHACUNGCAP(NCC_ten,NCC_diaChi)value( '${req.body.name}','${req.body.address}')`
      );
      res.json(true);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteSupplier(req, res) {
    try {
      const id = req.query.NCC_id;
      console.log(id);
      await queryMysql(`
          DELETE FROM NHACUNGCAP
          WHERE NCC_id = ${id}
        `);

      res.json("Xoa thanh cong");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new SupplierController();
