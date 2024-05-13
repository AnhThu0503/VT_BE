const queryMysql = require("../../database/mysql.js");
const cloudinary = require("../../service/cloundinary.js");

class ProductController {
  async createProduct(req, res) {
    try {
      const create_input_order =
        await queryMysql(`insert into HOADONNHAP(NCC_id,HDN_noiDung,HDN_ngayNhap)value(
                ${req.body.id_supplier_selected},
                '${req.body.noiDung}',
                '${req.body.ngayNhap}'
            )`);
      console.log(
        " ${req.body.id_category_selected}",
        req.body.id_category_selected
      );
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
      return res.status(200).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  }
  async deleteImageProduct(req, res) {
    try {
      const id = req.query.HA_id; // Access HA_id from the request body
      await queryMysql(`
            DELETE FROM HINHANH
            WHERE HA_id = ${id}
        `);
      res.json("Xoa thanh cong");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  }
  async countImage(req, res) {
    try {
      const id = req.query.product_id; // Retrieve product_id from the request body
      const count = await queryMysql(`
            SELECT COUNT(HA_id) AS image_count
            FROM HINHANH
            WHERE SP_id = ${id};
        `);
      const image_count = count[0].image_count;
      res.status(200).json({ image_count });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Failed to count images" });
    }
  }
  async countProduct(req, res) {
    try {
      const result = await queryMysql(
        `SELECT COUNT(SP_id) AS SoSanPham FROM SANPHAM;`
      );
      const numProducts = result[0].SoSanPham;
      res.status(200).json({ numProducts });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async updateProduct(req, res) {
    try {
      const id = req.body.SP_id;
      const update_product = await queryMysql(`
        UPDATE SANPHAM
        SET 
          SP_ten = '${req.body.SP_ten}',
        
          SP_soLuong = ${req.body.SP_soLuong},
          SP_trongLuong = ${req.body.SP_trongLuong},
          SP_donViTinh = '${req.body.SP_donViTinh}',
          SP_moTa = '${req.body.moTa}',
          DMSP_id = ${req.body.id_category_selected}
        WHERE SP_id = ${id}
      `);

      const update_price = await queryMysql(`
        UPDATE GIA
        SET 
          G_thoiGia = ${req.body.G_thoiGia}
        WHERE SP_id = ${id}
      `);
      const images = await queryMysql(
        `SELECT * FROM HINHANH WHERE SP_id=${id}`
      );
      const file_images = req.body.file_images;
      for (let i = 0; i < images.length; i++) {
        let image = images[i];
        for (let j = 0; j < file_images.length; j++) {
          let file_image = file_images[j];
          if (image.HA_id === file_image.HA_id) {
            if (image.HA_URL !== file_image.HA_URL) {
              const response = await cloudinary.uploader.upload(
                file_image.HA_URL
              );
              await queryMysql(
                `UPDATE HINHANH SET HA_URL='${response.url}' WHERE HA_id=${file_image.HA_id}`
              );
            }
          }
        }
      }
      for (let base64 of req.body.file_imagesadd) {
        const response = await cloudinary.uploader.upload(base64);
        let result = await queryMysql(
          `insert into hinhanh(SP_id,HA_URL)value(${id},'${response.url}')`
        );
      }

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
      const products = await queryMysql(`
            SELECT * FROM sanpham
            ORDER BY SP_HSD ASC
        `);

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
        product.images = images.reverse();
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
      const id = product[0].DMSP_id;
      const category = await queryMysql(
        `SELECT * FROM DANHMUCSANPHAM WHERE DMSP_id = ${id}`
      );
      const images = await queryMysql(
        `SELECT * FROM HINHANH WHERE SP_id = ${req.body.SP_id}`
      );
      res.json({ product, price, category, images });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProductSelect(req, res) {
    try {
      const products = await queryMysql(
        `select * from sanpham where SP_HSD >= CURRENT_DATE`
      );
      res.json(products);
    } catch (e) {
      console.error(e);
    }
  }

  async getProductStatic(req, res) {
    try {
      // Execute the SQL query against the database to get the top 3 products
      const productData = await queryMysql(`
        SELECT SP_id, COUNT(*) AS quantity_count 
        FROM CHI_TIET_DH 
        GROUP BY SP_id 
        ORDER BY quantity_count DESC 
      `);

      const productsOrder = [];
      const productReceipt = [];
      let j = 0;
      for (const product of productData) {
        let numStock = 0; // Initialize numStock inside the loop

        const getProduct = await queryMysql(
          `SELECT * FROM CHI_TIET_DH WHERE SP_id = ${product.SP_id}`
        );

        const inforProduct = await queryMysql(
          `SELECT * FROM SANPHAM WHERE  SP_id = ${product.SP_id} AND SP_HSD >= CURRENT_DATE`
        );

        let sum = 0;
        for (const productDB of getProduct) {
          sum += productDB.CTDH_soLuong;
        }
        numStock = sum;

        if (inforProduct.length > 0 && j <= 5) {
          j++;
          productsOrder.push({
            ten: inforProduct[0].SP_ten,
            soluong: sum,
          });

          const getProductReceipt = await queryMysql(
            `SELECT * FROM CHI_TIET_HDN WHERE SP_id = ${product.SP_id}`
          );
          const receiptQuantity =
            getProductReceipt.length > 0
              ? getProductReceipt[0].CTHDN_soLuong
              : 0;

          productReceipt.push({
            ten: inforProduct[0].SP_ten,
            soluong: receiptQuantity - numStock, // Calculate the difference
          });
        } else {
          console.log(`No product found for SP_id: ${product.SP_id}`);
        }
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

  async getProductStock(req, res) {
    try {
      // Execute the SQL query against the database to get products with quantity >= 1
      const productData = await queryMysql(`
        SELECT * FROM SANPHAM WHERE SP_soLuong >= 1 AND SP_HSD >= CURDATE()
      `);

      // Initialize an array to store product receipts
      const productReceipt = [];

      // Loop through each product and retrieve additional information
      for (const product of productData) {
        // Retrieve product information from SANPHAM table based on SP_id
        const inforProduct = await queryMysql(
          `SELECT SP_ten, SP_soLuong FROM SANPHAM WHERE SP_id = ${product.SP_id}`
        );

        // Ensure the product information is valid before pushing to productReceipt
        if (inforProduct && inforProduct.length > 0) {
          productReceipt.push({
            ten: inforProduct[0].SP_ten,
            soluong: inforProduct[0].SP_soLuong,
          });
        }
      }

      // Log the productReceipt for debugging
      console.log("productReceipt", productReceipt);

      // Send the productReceipt as a response
      return res.status(200).json({ productReceipt });
    } catch (error) {
      // Log the error for debugging
      console.log(error);

      // Send an error response
      return res
        .status(500)
        .json({ error: "Failed to retrieve product statistics" });
    }
  }

  async getProductStaticBanCham(req, res) {
    try {
      // Execute the SQL query against the database to get the top 3 products
      const productData = await queryMysql(` SELECT 
      SANPHAM.SP_id,
      SANPHAM.SP_ten,
      SANPHAM.SP_soLuong AS SP_soLuong,
      CHI_TIET_HDN.CTHDN_soLuong AS CTHDN_soLuong
  FROM 
      SANPHAM
  JOIN 
      CHI_TIET_HDN ON SANPHAM.SP_id = CHI_TIET_HDN.SP_id
  WHERE 
      ABS(CHI_TIET_HDN.CTHDN_soLuong - SANPHAM.SP_soLuong) <= 5 AND SP_HSD >= CURRENT_DATE
  ORDER BY ABS(CHI_TIET_HDN.CTHDN_soLuong - SANPHAM.SP_soLuong) ASC
  LIMIT 6
      `);

      const productsOrder = [];
      let numStock = 0; // Change const to let

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
        numStock = sum;
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
          soluong: getProduct[0].CTHDN_soLuong - numStock,
        });
      }

      // Send the result as a response
      console.log("productReceipt productReceipt", productReceipt);
      return res.status(200).json({ productsOrder, productReceipt });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Failed to retrieve product statistics" });
    }
  }
  async countProduct(req, res) {
    try {
      const result = await queryMysql(
        `SELECT COUNT(SP_id) AS SoSanPham FROM SANPHAM;`
      );
      const numProducts = result[0].SoSanPham;
      res.status(200).json({ numProducts });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async countProductHSD(req, res) {
    try {
      const result = await queryMysql(
        `SELECT COUNT(SP_id) AS SoSanPham FROM SANPHAM WHERE SP_HSD < CURRENT_DATE;`
      );
      const numProducts = result[0].SoSanPham;
      console.log("numhsd", numProducts);
      res.status(200).json({ numProducts });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async collectStatic(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Lấy doanh thu từ CSDL
      const revenueData = await queryMysql(`
        SELECT DATE_FORMAT(DH_ngayDat, '%Y-%m-%d') AS Ngay,
        SUM(DH_tongTien) AS DoanhThu
        FROM DONHANG
        WHERE DH_trangThai = 'Đã nhận hàng'
        AND DH_ngayDat BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY DATE_FORMAT(DH_ngayDat, '%Y-%m-%d')
        ORDER BY Ngay;
      `);

      // Tạo danh sách toàn bộ các ngày từ startDate đến endDate
      const dateList = [];
      let currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        dateList.push(currentDate.toISOString().split("T")[0]);
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }

      // Tạo mảng dữ liệu kết quả
      const revenueArray = dateList.map((date) => {
        const revenueEntry = revenueData.find((entry) => entry.Ngay === date);
        return {
          ngay: date,
          doanhThu: revenueEntry ? revenueEntry.DoanhThu : 0,
        };
      });
      console.log("revenueArray", revenueArray);
      res.json({ revenueArray });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new ProductController();
