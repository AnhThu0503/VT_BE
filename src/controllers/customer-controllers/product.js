const queryMysql = require("../../database/mysql.js");
class ProductController {
  async getAllProduct(req, res) {
    const products =
      await queryMysql(`SELECT * FROM soctrangspecial.sanpham as sp
            inner join soctrangspecial.gia as g on g.SP_id=sp.SP_id`);
    res.json(products);
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

      const products = await queryMysql(`SELECT * 
      FROM SANPHAM 
      WHERE SP_ten LIKE '%${query}%'`);

      res.json(products);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductController();
