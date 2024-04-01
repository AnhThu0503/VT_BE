const queryMysql = require("../../database/mysql.js");
class OrderController {
  async getAllOrder(req, res) {
    try {
      const orders = await queryMysql("SELECT * FROM DONHANG;");
      let arrOrders = [];

      await Promise.all(
        orders.map(async (order) => {
          const user = await queryMysql(
            `SELECT * FROM NGUOI_DUNG WHERE ND_id = ${order.ND_id}`
          );
          const orderDetail = await queryMysql(
            `SELECT * FROM CHI_TIET_DH WHERE DH_id = ${order.DH_id}`
          );

          let detailOrderProduct = [];

          await Promise.all(
            orderDetail.map(async (detail) => {
              const product = await queryMysql(
                `SELECT * FROM SANPHAM WHERE SP_id = ${detail.SP_id}`
              );
              detailOrderProduct.push({
                ...product,
                soluong: detail.CTDH_soLuong,
              });
            })
          );
          arrOrders.push({ order, user, detailOrderProduct });
        })
      );

      res.json(arrOrders);
    } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateStatusOrder(req, res) {
    try {
      await queryMysql(`
      UPDATE DONHANG
      SET DH_trangThai = '${req.body.trangthai}'
      WHERE DH_id = ${req.body.DH_id}
    `);

      // Return a success message
      res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async countOrder(req, res) {
    try {
      // Assuming queryMysql is a function that executes MySQL queries asynchronously
      const result = await queryMysql(
        `SELECT COUNT(DH_id) AS SoDonHang FROM DONHANG;`
      );

      // Assuming queryMysql returns an array of rows, we extract the first row
      const numOrders = result[0].SoDonHang;

      // Sending the response back
      res.status(200).json({ numOrders });
    } catch (error) {
      // Handling errors
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async countOrderConfirm(req, res) {
    try {
      // Assuming queryMysql is a function that executes MySQL queries asynchronously
      const result = await queryMysql(
        `SELECT COUNT(DH_id) AS SoDonHang FROM DONHANG WHERE DH_trangThai = 'Chờ xác nhận';`
      );

      // Assuming queryMysql returns an array of rows, we extract the first row
      const numOrdersConfirm = result[0].SoDonHang;
      console.log(numOrdersConfirm);
      // Sending the response back
      res.status(200).json({ numOrdersConfirm });
    } catch (error) {
      // Handling errors
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new OrderController();
