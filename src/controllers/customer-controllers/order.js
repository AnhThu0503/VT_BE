const queryMysql = require("../../database/mysql.js");
class OrderController {
  async createOrder(req, res) {
    try {
      // Insert the order into DONHANG table
      const order = await queryMysql(
        `INSERT INTO DONHANG (ND_id, DH_tongTien, DH_ngayDat, DH_trangthai, DH_phuongThucTT) VALUES (${req.body.ND_id}, ${req.body.tongtien}, CURDATE(), '${req.body.trangthai}', '${req.body.PTTT}')`
      );
      console.log("Created order:", order);

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

        // Update product quantity
        await queryMysql(`
          UPDATE SANPHAM
          SET SP_soLuong = ${currentQuantityProduct}
          WHERE SP_id = ${product.SP_id}
        `);

        console.log(`Updated quantity for product with ID ${product.SP_id}`);
        // console.log("Created order detail:", orderDetail);
      });

      const giohang = await queryMysql(
        `SELECT * FROM giohang WHERE ND_id = ${req.body.ND_id}`
      );

      const giohangId = giohang[0].GH_id;

      // console.log(giohang[0].ND_id);

      await queryMysql(`DELETE FROM sp_giohang WHERE GH_id = ${giohangId}`);

      res.status(200).json({ message: "Order created successfully" });
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
}

module.exports = new OrderController();
