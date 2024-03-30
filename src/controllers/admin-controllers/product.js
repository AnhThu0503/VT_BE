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
                '${req.body.ngayNhap}'
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
      console.log("nsx", req.body.SP_NSX);
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
        product.G_giaBanDau = prices.length > 0 ? prices[0].G_giaBanDau : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";
        let product_discount = await queryMysql(
          `SELECT * FROM khuyenmai WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id=${product.SP_id}`
        );
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;

        // Lấy thông tin danh mục sản phẩm cho sản phẩm hiện tại
        let category = await queryMysql(
          `SELECT * FROM DANHMUCSANPHAM WHERE DMSP_id = ${product.DMSP_id}`
        );
        product.category = category.length > 0 ? category[0] : null;
      }

      res.json({ products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await queryMysql(`SELECT *
        FROM SANPHAM
        WHERE SP_id = ${req.body.SP_id}`);

      const price = await queryMysql(`SELECT *
        FROM GIA
        WHERE SP_id = ${req.body.SP_id}`);
      const id = product[0].DMSP_id; // Access DMSP_id from the first row of the product result
      const category = await queryMysql(
        `SELECT * FROM DANHMUCSANPHAM WHERE DMSP_id = ${id}`
      ); // Fix interpolation syntax
      res.json({ product, price, category });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProductSelect(req, res) {
    try {
      const products = await queryMysql(`select * from sanpham`);
      console.log("product select", products);
      res.json(products);
    } catch (e) {
      console.error(e);
    }
  }

  async getProductStatic(req, res) {
    try {
      // Execute the SQL query against the database to get the top 3 products
      const productData = await queryMysql(
        "SELECT SP_id, COUNT(*) AS quantity_count FROM CHI_TIET_DH GROUP BY SP_id ORDER BY quantity_count DESC LIMIT 3;"
      );

      const productsOrder = [];

      for (const product of productData) {
        const getProduct = await queryMysql(
          `SELECT * FROM CHI_TIET_DH WHERE SP_id =${product.SP_id}`
        );

        const inforProduct = await queryMysql(
          `SELECT * FROM SANPHAM WHERE SP_id =${product.SP_id}`
        );
        let sum = 0;
        for (const productDB of getProduct) {
          sum += productDB.CTDH_soLuong;
        }
        productsOrder.push({
          ten: inforProduct[0].SP_ten,
          soluong: sum,
        });
      }

      const productReceipt = [];
      for (const product of productData) {
        const getProduct = await queryMysql(
          `SELECT * FROM CHI_TIET_HDN WHERE SP_id =${product.SP_id}`
        );
        const inforProduct = await queryMysql(
          `SELECT * FROM SANPHAM WHERE SP_id =${product.SP_id}`
        );

        console.log(getProduct);
        productReceipt.push({
          ten: inforProduct[0].SP_ten,
          soluong: getProduct[0].CTHDN_soLuong,
        });
      }

      // Send the result as a response
      return res.status(200).json({ productsOrder, productReceipt });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Failed to retrieve product statistics" });
    }
  }
}

module.exports = new ProductController();
