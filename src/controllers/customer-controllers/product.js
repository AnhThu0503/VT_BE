const queryMysql = require("../../database/mysql.js");
class ProductController {
  async getAllProduct(req, res) {
    const products =
      await queryMysql(`SELECT * FROM soctrangspecial.sanpham as sp
            inner join soctrangspecial.gia as g on g.SP_id=sp.SP_id`);
    res.json(products);
  }
  async getProductAll(req, res) {
    try {
      const products = await queryMysql(`SELECT * FROM sanpham`);
      const length = products.length;

      for (let i = 0; i < length; i++) {
        let product = products[i];

        let images = await queryMysql(
          `SELECT HA_URL FROM hinhanh WHERE SP_id=${product.SP_id}`
        );
        let prices = await queryMysql(
          `SELECT * FROM gia WHERE SP_id=${product.SP_id}`
        );
        product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";

        let product_discount = await queryMysql(
          `SELECT * FROM khuyenmai WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id=${product.SP_id}`
        );
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;
      }

      console.log("product all: ", products);
      res.json({ products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProductOfCatetory(req, res) {
    let products = await queryMysql(
      `select * from sanpham where DMSP_id=${req.query.DMSP_id}`
    );
    let categorys = await queryMysql(
      `select * from danhmucsanpham where DMSP_id=${req.query.DMSP_id}`
    );
    for (let product of products) {
      let images = await queryMysql(
        `select HA_URL from hinhanh where SP_id=${product.SP_id}`
      );
      let prices = await queryMysql(
        `select * from gia where SP_id=${product.SP_id}`
      );
      product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
      product.image = images.length > 0 ? images[0].HA_URL : "";
      let product_discount = await queryMysql(
        `select * from khuyenmai where CURDATE() BETWEEN KM_ngayBatDau and KM_ngayKetThuc and SP_id=${product.SP_id}`
      );
      product.discount =
        product_discount.length > 0 ? product_discount[0] : null;
    }
    res.json({ products, category: categorys[0] });
  }

  async getProduct(req, res) {
    let products = await queryMysql(
      `select * from sanpham where SP_id=${req.query.SP_id}`
    );
    let relate_products = await queryMysql(
      `select * from sanpham where SP_id!=${req.query.SP_id} and DMSP_id=${products[0].DMSP_id} limit 5`
    );
    for (let product of relate_products) {
      let images = await queryMysql(
        `select HA_URL from hinhanh where SP_id=${product.SP_id}`
      );
      let prices = await queryMysql(
        `select * from gia where SP_id=${product.SP_id}`
      );
      product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
      product.image = images.length > 0 ? images[0].HA_URL : "";
      let product_discount = await queryMysql(
        `select * from khuyenmai where CURDATE() BETWEEN KM_ngayBatDau and KM_ngayKetThuc and SP_id=${product.SP_id}`
      );
      product.discount =
        product_discount.length > 0 ? product_discount[0] : null;
    }
    let images = await queryMysql(
      `select HA_URL from hinhanh where SP_id=${products[0].SP_id}`
    );
    let prices = await queryMysql(
      `select * from gia where SP_id=${products[0].SP_id}`
    );
    products[0].SP_gia = prices.length > 0 ? prices[0].G_thoiGia : 0;
    products[0].images = images.reverse();
    let product_discount = await queryMysql(
      `select * from khuyenmai where CURDATE() BETWEEN KM_ngayBatDau and KM_ngayKetThuc and SP_id=${products[0].SP_id}`
    );
    res.json({
      product: {
        ...products[0],
        discount: product_discount.length == 1 ? product_discount[0] : null,
      },
      relate_products: relate_products,
    });
  }

  async searchProduct(req, res) {
    try {
      const query = req.body.SP_ten;

      const products = await queryMysql(`
            SELECT SANPHAM.*, 
                   (SELECT HA_URL FROM HINHANH WHERE SANPHAM.SP_id = HINHANH.SP_id LIMIT 1) AS first_image, 
                   (SELECT G_thoiGia FROM GIA WHERE SANPHAM.SP_id = GIA.SP_id LIMIT 1) AS price
            FROM SANPHAM
            WHERE SANPHAM.SP_ten LIKE '%${query}%'
        `);

      res.json(products);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new ProductController();
