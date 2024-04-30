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
      const products = await queryMysql(`
        SELECT * FROM sanpham WHERE SP_HSD >= CURDATE()
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
        product.image = images.length > 0 ? images[0].HA_URL : "";

        let product_discount = await queryMysql(
          `SELECT * FROM khuyenmai WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id=${product.SP_id}`
        );
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;
      }

      res.json({ products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProductOfCatetory(req, res) {
    let products = await queryMysql(
      `select * from sanpham where DMSP_id=${req.query.DMSP_id} AND SP_HSD >= CURDATE()`
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
  async getTotalSalesProduct(req, res) {
    try {
      const query = `SELECT COUNT(*) AS total_sales
                       FROM CHI_TIET_DH
                       WHERE SP_id = ${req.query.SP_id} `;

      const products = await queryMysql(query); // Assuming queryMysql is defined elsewhere
      res.status(200).json({ total_sales: products[0].total_sales });
    } catch (error) {
      console.error("Error retrieving total sales:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving total sales." });
    }
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
      (SELECT G_thoiGia FROM GIA WHERE SANPHAM.SP_id = GIA.SP_id LIMIT 1) AS price,
      KHUYENMAI.KM_id AS km_id,
      KHUYENMAI.KM_ngayBatDau AS km_ngayBatDau,
      KHUYENMAI.KM_ngayKetThuc AS km_ngayKetThuc,
      KHUYENMAI.KM_mucGiamGia AS km_mucGiamGia
      FROM SANPHAM
      LEFT JOIN KHUYENMAI ON SANPHAM.SP_id = KHUYENMAI.SP_id AND CURDATE() BETWEEN KHUYENMAI.KM_ngayBatDau AND KHUYENMAI.KM_ngayKetThuc
      WHERE SP_HSD >= CURDATE() AND SANPHAM.SP_ten LIKE '%${query}%';

      `);

      res.json(products);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProductDiscount(req, res) {
    try {
      // Query to select products with associated discounts
      const products = await queryMysql(`
      SELECT sanpham.*
      FROM sanpham
      JOIN khuyenmai ON sanpham.SP_id = khuyenmai.SP_id 
      WHERE SP_HSD >= CURDATE() AND CURDATE() BETWEEN khuyenmai.KM_ngayBatDau AND khuyenmai.KM_ngayKetThuc 
      LIMIT 4;
      
      `);
      // Loop through each product to fetch additional data
      for (let i = 0; i < products.length; i++) {
        let product = products[i];

        // Fetch images associated with the product
        const images = await queryMysql(`
          SELECT HA_URL FROM hinhanh WHERE SP_id = ${product.SP_id}
        `);

        // Fetch prices associated with the product
        const prices = await queryMysql(`
          SELECT * FROM gia WHERE SP_id = ${product.SP_id}
        `);

        // Assign price and image data to the product
        product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";

        // Fetch discount information for the product
        const productDiscount = await queryMysql(`
          SELECT * FROM khuyenmai WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id = ${product.SP_id}
        `);
        // Assign discount data to the product
        product.discount =
          productDiscount.length > 0 ? productDiscount[0] : null;

        console.log("-------------------------------");
        console.log("productDiscount", productDiscount);
        console.log("product discount", product.discount);
      }

      // Send the products with associated data as response
      res.json({ products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAllProductDiscount(req, res) {
    try {
      // Query to select products with associated discounts
      const products = await queryMysql(`
      SELECT sanpham.*
      FROM sanpham 
      JOIN khuyenmai ON sanpham.SP_id = khuyenmai.SP_id
      WHERE sanpham.SP_HSD >= CURRENT_DATE AND CURDATE() BETWEEN khuyenmai.KM_ngayBatDau AND khuyenmai.KM_ngayKetThuc;
      
      `);

      // Loop through each product to fetch additional data
      for (let i = 0; i < products.length; i++) {
        let product = products[i];

        // Fetch images associated with the product
        const images = await queryMysql(`
          SELECT HA_URL FROM hinhanh WHERE SP_id = ${product.SP_id}
        `);

        // Fetch prices associated with the product
        const prices = await queryMysql(`
          SELECT * FROM gia WHERE SP_id = ${product.SP_id}
        `);

        // Assign price and image data to the product
        product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";

        // Fetch discount information for the product
        const productDiscount = await queryMysql(`
          SELECT * FROM khuyenmai WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id = ${product.SP_id}
        `);

        // Assign discount data to the product
        product.discount =
          productDiscount.length > 0 ? productDiscount[0] : null;
      }

      // Send the products with associated data as response
      res.json({ products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAllProductBanChay(req, res) {
    try {
      const products = [];
      // Fetch all products with their quantity counts
      const productData = await queryMysql(
        "SELECT SP_id, COUNT(*) AS quantity_count FROM CHI_TIET_DH GROUP BY SP_id ORDER BY quantity_count DESC LIMIT 4;"
      );

      const productReceipt = [];
      for (const product of productData) {
        const getProduct = await queryMysql(
          `SELECT * FROM CHI_TIET_HDN WHERE SP_id = ${product.SP_id}`
        );
        const inforProduct = await queryMysql(
          `SELECT SP_id, SP_ten, SP_trongLuong, SP_donViTinh, DMSP_id FROM SANPHAM WHERE SP_id = ${product.SP_id} AND SP_HSD >= CURRENT_DATE`
        );

        productReceipt.push({
          SP_id: inforProduct[0].SP_id, // Add SP_id to productReceipt
          SP_ten: inforProduct[0].SP_ten,
          SP_trongLuong: inforProduct[0].SP_trongLuong,
          SP_donViTinh: inforProduct[0].SP_donViTinh,
          soluong: getProduct[0].CTHDN_soLuong,
          DMSP_id: inforProduct[0].DMSP_id, // Add DMSP_id to productReceipt
        });
      }

      // Iterate through each product
      for (let i = 0; i < productReceipt.length; i++) {
        let product = productReceipt[i];

        // Fetch images for the current product
        let images = await queryMysql(
          `SELECT HA_URL FROM HINHANH WHERE SP_id = ${product.SP_id}`
        );
        // Fetch prices for the current product
        let prices = await queryMysql(
          `SELECT * FROM GIA WHERE SP_id = ${product.SP_id}`
        );
        // Fetch discounts for the current product that are active today
        let product_discount = await queryMysql(
          `SELECT * FROM KHUYENMAI WHERE CURDATE() BETWEEN KM_ngayBatDau AND KM_ngayKetThuc AND SP_id = ${product.SP_id}`
        );
        // Fetch category for the current product
        let category = await queryMysql(
          `SELECT * FROM DANHMUCSANPHAM WHERE DMSP_id = ${product.DMSP_id}`
        );

        // Set additional properties for the product
        product.price = prices.length > 0 ? prices[0].G_thoiGia : 0;
        product.G_giaBanDau = prices.length > 0 ? prices[0].G_giaBanDau : 0;
        product.image = images.length > 0 ? images[0].HA_URL : "";
        product.discount =
          product_discount.length > 0 ? product_discount[0] : null;
        product.category = category.length > 0 ? category[0] : null;
      }

      // Send the products data as JSON response
      res.json({ products: productReceipt });
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new ProductController();
