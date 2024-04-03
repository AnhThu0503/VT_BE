const express = require("express");
const categoryController = require("../../controllers/admin-controllers/category");
const productController = require("../../controllers/admin-controllers/product");
const usercontroller = require("../../controllers/admin-controllers/user");
const orderController = require("../../controllers/admin-controllers/order");
const discountController = require("../../controllers/admin-controllers/discount");
const orderNController = require("../../controllers/admin-controllers/orderN");
const blogController = require("../../controllers/admin-controllers/blog");
const router = express.Router();

router.get("/category-and-supplier", categoryController.getCategoryAndSupplier);
router.get("/product", productController.getProductAll);
router.get("/products-select", productController.getAllProductSelect);
router.get("/category", categoryController.getAllCategory);
router.get("/users", usercontroller.getAllUser);
router.get("/orders", orderController.getAllOrder);
router.get("/ordersN", orderNController.getAllOrderN);
router.get("/discounts", discountController.getAllDiscount);
router.get("/static", productController.getProductStatic);
router.get("/static-bancham", productController.getProductStaticBanCham);
router.get("/orders-count", orderController.countOrder);
router.get("/ordersConfirm-count", orderController.countOrderConfirm);
router.get("/products-count", productController.countProduct);
router.get("/users-count", usercontroller.countUser);
router.get("/collect", productController.collectStatic);

router.post("/user/update", usercontroller.getUser);
router.post("/discount", discountController.createDiscount);
router.post("/blog", blogController.createBlog);
router.post("/product", productController.createProduct);
router.post("/product/update", productController.getProduct);
router.post("/discount/update", discountController.getDiscount);
router.post("/category", categoryController.uploadProductCategory);

router.put("/user/update", usercontroller.updateCustomer);
router.put("/discount/update", discountController.updateDiscount);
router.put("/order/update", orderController.updateStatusOrder);
router.put("/product/update", productController.updateProduct);

router.delete("/user/delete", usercontroller.deleteUser);
router.delete("/discount/delete", discountController.deleteDiscount);
router.delete("/category/delete", categoryController.deleteCategory);
router.delete("/product/delete", productController.deleteProduct);
module.exports = router;
