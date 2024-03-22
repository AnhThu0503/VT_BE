const express = require("express");
const categoryController = require("../../controllers/admin-controllers/category");
const productController = require("../../controllers/admin-controllers/product");
const usercontroller = require("../../controllers/admin-controllers/user");
const orderController = require("../../controllers/admin-controllers/order");
const router = express.Router();

router.get("/category-and-supplier", categoryController.getCategoryAndSupplier);
router.get("/product", productController.getAllProduct);
router.get("/category", categoryController.getAllCategory);
router.get("/users", usercontroller.getAllUser);
router.get("/orders", orderController.getAllOrder);

router.post("/product", productController.createProduct);
router.post("/product/update", productController.getProduct);

router.put("/order/update", orderController.updateStatusOrder);
router.put("/product/update", productController.updateProduct);

router.delete("/product/delete", productController.deleteProduct);
module.exports = router;
