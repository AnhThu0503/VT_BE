const queryMysql = require("../../database/mysql.js");
class OrderController {
  async createOrder(req, res) {
    try {
      let flag = false;
      // Insert the order into DONHANG table
      const order = await queryMysql(
        `INSERT INTO DONHANG (ND_id, DH_tongTien, DH_ngayDat, DH_trangthai, DH_phuongThucTT) VALUES (${req.body.ND_id}, ${req.body.tongtien}, CURDATE(), '${req.body.trangthai}', '${req.body.PTTT}')`
      );

      // Obtain the last inserted ID (DH_id)
      const orderId = order.insertId;

      // Insert order details into CHI_TIET_DH table
      req.body.sanpham.forEach(async (product) => {
        const orderDetail = await queryMysql(`
          INSERT INTO CHI_TIET_DH (DH_id, SP_id, CTDH_soLuong)
          VALUES (${orderId}, ${product.SP_id}, ${product.soLuong})
        `);

        // Retrieve old quantity of the product
        const oldQuantityProduct = await queryMysql(`
          SELECT SP_soLuong
          FROM SANPHAM
          WHERE SP_id = ${product.SP_id}
        `);
        // Extract the quantity from the result (assuming SP_soLuong is returned as a property of the result)
        const oldQuantity = oldQuantityProduct[0].SP_soLuong;

        // Calculate new quantity
        const currentQuantityProduct = oldQuantity - parseInt(product.soLuong);
        console.log(currentQuantityProduct);
        if (currentQuantityProduct <= 0) {
          flag = true;
          return res
            .status(400)
            .json({ error: "Product quantity is not sufficient" });
        }
        // Update product quantity
        await queryMysql(`
          UPDATE SANPHAM
          SET SP_soLuong = ${currentQuantityProduct}
          WHERE SP_id = ${product.SP_id}
        `);
      });

      if (!flag) {
        const giohang = await queryMysql(
          `SELECT * FROM giohang WHERE ND_id = ${req.body.ND_id}`
        );

        const giohangId = giohang[0].GH_id;

        await queryMysql(`DELETE FROM sp_giohang WHERE GH_id = ${giohangId}`);

        return res.status(200).json({ message: "Order created successfully" });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  async getAllOrder(req, res) {
    const products =
      await queryMysql(`SELECT * FROM soctrangspecial.sanpham as sp
            inner join soctrangspecial.gia as g on g.SP_id=sp.SP_id`);
    res.json(products);
  }

  async getOrdersOfCustomer(req, res) {
    try {
      if (req.query?.ND_id) {
        const orders = await queryMysql(
          `SELECT * FROM DONHANG WHERE ND_id=${req.query.ND_id}`
        );

        let arrOrders = [];

        await Promise.all(
          orders.map(async (order) => {
            const orderDetail = await queryMysql(
              `SELECT * FROM CHI_TIET_DH WHERE DH_id = ${order.DH_id}`
            );

            const detailOrderProduct = await Promise.all(
              orderDetail.map(async (detail) => {
                const product = await queryMysql(
                  `SELECT * FROM SANPHAM WHERE SP_id = ${detail.SP_id}`
                );

                const images = await queryMysql(
                  `SELECT HA_URL FROM HINHANH WHERE SP_id = ${detail.SP_id}`
                );

                return {
                  ...product[0], // Assuming product is an array, taking the first item
                  soluong: detail.CTDH_soLuong,
                  hinhanh: images.length > 0 ? images[0].HA_URL : null,
                };
              })
            );

            arrOrders.push({ order, detailOrderProduct });
          })
        );

        res.json(arrOrders);
      }
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
}

module.exports = new OrderController();
