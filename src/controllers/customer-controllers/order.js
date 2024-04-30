const queryMysql = require("../../database/mysql.js");
class OrderController {
  async createOrder(req, res) {
    try {
      let flag = false;
      const order = await queryMysql(
        `INSERT INTO DONHANG (ND_id, DH_tongTien, DH_ngayDat, DH_trangthai, DH_phuongThucTT) VALUES (${req.body.ND_id}, ${req.body.tongtien}, CURDATE(), '${req.body.trangthai}', '${req.body.PTTT}')`
      );
      const orderId = order.insertId;
      console.log("============product", req.body.sanpham);
      for (const product of req.body.sanpham) {
        let giaBan = product.discount
          ? product.G_thoiGia - product.discount.KM_mucGiamGia
          : product.G_thoiGia;
        console.log("giaBan", giaBan);
        const orderDetail = await queryMysql(`
          INSERT INTO CHI_TIET_DH (DH_id, SP_id, CTDH_soLuong,CTDH_giaBan)
          VALUES (${orderId}, ${product.SP_id}, ${product.soLuong},${giaBan})
        `);

        const oldQuantityProduct = await queryMysql(`
          SELECT SP_soLuong
          FROM SANPHAM
          WHERE SP_id = ${product.SP_id}
        `);
        const oldQuantity = oldQuantityProduct[0].SP_soLuong;

        const currentQuantityProduct = oldQuantity - parseInt(product.soLuong);

        if (currentQuantityProduct <= 0) {
          flag = true;
          await queryMysql(`DELETE FROM DONHANG WHERE DH_id = ${orderId}`);
          await queryMysql(`DELETE FROM CHI_TIET_DH WHERE DH_id = ${orderId}`);
          return res
            .status(400)
            .json({ error: "Product quantity is not sufficient" });
        }

        await queryMysql(`
          UPDATE SANPHAM
          SET SP_soLuong = ${currentQuantityProduct}
          WHERE SP_id = ${product.SP_id}
        `);
      }

      if (!flag) {
        const giohang = await queryMysql(
          `SELECT * FROM giohang WHERE ND_id = ${req.body.ND_id}`
        );
        const giohangId = giohang[0].GH_id;
        await queryMysql(`DELETE FROM sp_giohang WHERE GH_id = ${giohangId}`);
      }

      return res.status(200).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
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
          `SELECT * FROM DONHANG WHERE ND_id=${req.query.ND_id} ORDER BY DH_Id DESC`
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
                  giaBan: detail.CTDH_giaBan,

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

  async isOrderOk(req, res) {
    try {
      const { sanpham } = req.body;
      let tmp = true;
      for (const product of sanpham) {
        const oldQuantityProduct = await queryMysql(`
          SELECT SP_soLuong
          FROM SANPHAM
          WHERE SP_id = ${product.SP_id}
        `);
        const oldQuantity = oldQuantityProduct[0].SP_soLuong;

        if (oldQuantity <= 1) {
          tmp = false;
        }
      }
      res.json(tmp);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new OrderController();
