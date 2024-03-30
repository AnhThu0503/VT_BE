const queryMysql = require("../../database/mysql.js");
class OrderNController {
  async getAllOrderN(req, res) {
    try {
      const ordersN = await queryMysql("SELECT * FROM HOADONNHAP;");
      let arrOrdersN = [];

      await Promise.all(
        ordersN.map(async (orderN) => {
          const orderDetail = await queryMysql(
            `SELECT * FROM CHI_TIET_HDN WHERE HDN_id = ${orderN.HDN_id}`
          );

          let detailOrderProductN = [];

          await Promise.all(
            orderDetail.map(async (detail) => {
              const product = await queryMysql(
                `SELECT * FROM SANPHAM WHERE SP_id = ${detail.SP_id}`
              );
              detailOrderProductN.push({
                ...product,
                soluong: detail.CTHDN_soLuong,
                giaNhap: detail.CTHDN_giaNhap,
              });
            })
          );
          arrOrdersN.push({ orderN, detailOrderProductN });
        })
      );

      res.json(arrOrdersN);
    } catch (error) {
      console.error("Error retrieving orders nhap:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new OrderNController();
