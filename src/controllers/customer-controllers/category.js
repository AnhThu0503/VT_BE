const queryMysql = require("../../database/mysql.js");

class CategoryController {
  async getCategorys(req, res) {
    try {
      const categorys = await queryMysql(`select * from danhmucsanpham`);
      res.json(categorys);
    } catch (e) {
      console.error(e);
    }
  }

  async getProductsHome(req, res) {
    const categorys = await queryMysql(`select * from danhmucsanpham`);
    for (let cate of categorys) {
      let products = await queryMysql(
        `select * from sanpham where DMSP_id=${cate.DMSP_id} AND SP_HSD >= CURRENT_DATE limit 4`
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
      cate.products = products;
    }
    for (let i = 0; i < categorys.length; i++) {
      if (categorys[i].products.length === 0) {
        categorys.splice(i, 1);
        i--;
      }
    }
    res.json(categorys);
  }
}

module.exports = new CategoryController();
