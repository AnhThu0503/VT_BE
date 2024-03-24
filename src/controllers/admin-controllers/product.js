const queryMysql = require("../../database/mysql.js");
const cloudinary = require("../../service/cloundinary.js");

class ProductController {
  async createProduct(req, res) {
    try {
      const create_input_order =
        await queryMysql(`insert into HOADONNHAP(NCC_id,HDN_noiDung,HDN_tongTien,HDN_ngayNhap)value(
                ${req.body.id_supplier_selected},
                '${req.body.noiDung}',
                ${req.body.tongTien},
                '${req.body.dateNhap}'
            )`);
      const create_product =
        await queryMysql(`insert into sanpham(DMSP_id,SP_ten,SP_NSX,SP_HSD,SP_soLuong,SP_trongLuong,SP_donViTinh,SP_moTa)value(
                ${req.body.id_category_selected},
                '${req.body.name}',
                '${req.body.NSX}',
                '${req.body.HSD}',
                ${req.body.soLuong},
                ${req.body.trongLuong},
                '${req.body.donViTinh}',
                '${req.body.moTa}'
            )`);

      const create_price =
        await queryMysql(`insert into gia(SP_id,G_giaBanDau,G_thoiGia)value(
                ${create_product.insertId},
                ${req.body.giaNhap},
                ${req.body.giaBan}
            )`);

      const detail =
        await queryMysql(`insert into chi_tiet_hdn(HDN_id,SP_id,CTHDN_soLuong,CTHDN_giaNhap)value(
                ${create_input_order.insertId},
                ${create_product.insertId},
                ${req.body.soLuong},
                ${req.body.giaNhap}

            )`);
      for (let base64 of req.body.file_images) {
        const response = await cloudinary.uploader.upload(base64);
        let result = await queryMysql(
          `insert into hinhanh(SP_id,HA_URL)value(${create_product.insertId},'${response.url}')`
        );
      }
      res.json(true);
    } catch (e) {
      console.error(e);
    }
  }
  async updateCustomer(req, res) {
    try {
      if (req.body?.ND_id && req.body?.name && req.body?.phone) {
        const update_customer = await queryMysql(`update nguoi_dung set 
                ND_ten='${req.body.name}',
                ND_SDT='${req.body.phone}'
                where ND_id=${req.body.ND_id}
            `);
        res.json(update_customer.affectedRows > 0 ? true : false);
      } else {
        res.json(false);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async updateProduct(req, res) {
    try {
      const id = req.body.SP_id;

      const update_product = await queryMysql(`
        UPDATE SANPHAM
        SET 
          SP_ten = '${req.body.SP_ten}',
          SP_NSX = '${req.body.SP_NSX}',
          SP_HSD = '${req.body.SP_HSD}',
          SP_soLuong = ${req.body.SP_soLuong},
          SP_trongLuong = ${req.body.SP_trongLuong},
          SP_donViTinh = '${req.body.SP_donViTinh}',
          SP_moTa = '${req.body.SP_moTa}'
        WHERE SP_id = ${id}
      `);

      const update_price = await queryMysql(`
        UPDATE GIA
        SET 
          G_thoiGia = ${req.body.G_thoiGia}
        WHERE SP_id = ${id}
      `);

      res.json("update success");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
  async deleteProduct(req, res) {
    try {
      const id = req.query.SP_id;
      console.log(id);
      await queryMysql(`
      DELETE FROM SANPHAM
      WHERE SP_id = ${id}
    `);
      await queryMysql(`
      DELETE FROM GIA
      WHERE SP_id = ${id}
    `);
      await queryMysql(`
      DELETE FROM HINHANH
      WHERE SP_id = ${id}
    `);
      res.json("Xoa thanh cong");
    } catch (error) {
      console.log(error);
    }
  }
  async getAllProduct(req, res) {
    const products =
      await queryMysql(`SELECT * FROM soctrangspecial.sanpham as sp
            inner join soctrangspecial.gia as g on g.SP_id=sp.SP_id`);
    res.json(products);
  }

  async getProduct(req, res) {
    try {
      const product = await queryMysql(`SELECT *
        FROM SANPHAM
        WHERE SP_id = ${req.body.SP_id}`);

      const price = await queryMysql(`SELECT *
        FROM GIA
        WHERE SP_id = ${req.body.SP_id}`);

      res.json({ product, price });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductController();
