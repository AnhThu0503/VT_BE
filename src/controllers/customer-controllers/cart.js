const queryMysql = require("../../database/mysql.js");

class CartController {
  async addToCart(req, res) {
    try {
      const carts = await queryMysql(
        `select GH_id from giohang where ND_id=${req.body.ND_id}`
      );
      if (carts.length === 1) {
        const count_product = await queryMysql(
          `select count(SPGH_id) as value from sp_giohang where GH_id=${carts[0].GH_id} and SP_id=${req.body.SP_id}`
        );

        if (count_product[0].value === 0) {
          const create_product_cart = await queryMysql(
            `insert into sp_giohang(GH_id,SP_id,soLuong)value(${carts[0].GH_id},${req.body.SP_id},${req.body.numberProduct})`
          );
          if (create_product_cart.insertId > 0) {
            res.json(true);
          } else {
            res.json(false);
          }
        } else {
          const update_product_cart = await queryMysql(
            `update sp_giohang set soluong=soluong + ${req.body.numberProduct} where GH_id=${carts[0].GH_id} and SP_id=${req.body.SP_id}`
          );

          if (update_product_cart.affectedRows > 0) {
            res.json(true);
          } else {
            res.json(false);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getAllItem(req, res) {
    try {
      const products =
        await queryMysql(`select sanpham.SP_id, SP_ten, SP_trongLuong,SP_donViTinh, sp_giohang.soLuong, G_thoiGia, sp_giohang.SPGH_id from sanpham
                inner join sp_giohang on sp_giohang.SP_id=sanpham.SP_id
                inner join giohang on giohang.GH_id=sp_giohang.GH_id
                inner join gia on gia.SP_id=sanpham.SP_id
                where giohang.ND_id=${req.query.ND_id}
            `);
      for (let product of products) {
        const images = await queryMysql(
          `select HA_URL from hinhanh where SP_id=${product.SP_id}`
        );
        product.image = images[0].HA_URL;
        let product_discount = await queryMysql(
          `select * from khuyenmai where CURDATE() BETWEEN KM_ngayBatDau and KM_ngayKetThuc and SP_id=${product.SP_id}`
        );
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;
      }
      res.json(products);
    } catch (e) {
      console.error(e);
    }
  }

  async removeItem(req, res) {
    try {
      const remove_item = await queryMysql(
        `delete from sp_giohang where SPGH_id=${req.query.SPGH_id}`
      );
      if (remove_item.affectedRows > 0) {
        res.json(true);
      } else {
        res.json(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async sumItemCart(req, res) {
    try {
      const remove_item = await queryMysql(
        `select sum(soLuong) as sum from sp_giohang, giohang where giohang.GH_id=sp_giohang.GH_id and ND_id=${req.query.ND_id}`
      );
      res.json(remove_item[0].sum);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new CartController();
