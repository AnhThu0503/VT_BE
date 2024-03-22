const express = require("express");
const productController = require("../../controllers/customer-controllers/product");
const categoryController = require("../../controllers/customer-controllers/category");
const registerController = require("../../controllers/customer-controllers/register");
const loginController = require("../../controllers/customer-controllers/login");
const cartController = require("../../controllers/customer-controllers/cart");
const orderController = require("../../controllers/customer-controllers/order");
const customerController = require("../../controllers/customer-controllers/customer");
const commentController = require("../../controllers/customer-controllers/commt");

const router = express.Router();

router.get("/products", productController.getAllProduct);
router.get("/product", productController.getProduct);
router.get("/categorys", categoryController.getCategorys);
router.get("/products-home", categoryController.getProductsHome);
router.get("/products/category", productController.getProductOfCatetory);
router.get("/login", loginController.authenUser);
router.get("/cart/items", cartController.getAllItem);
router.get("/cart/sum", cartController.sumItemCart);
router.get("/customer", customerController.getCustomerInfo);
router.get("/comments", commentController.getComments);

router.post("/products/search", productController.searchProduct);
router.post("/order", orderController.createOrder);
router.post("/login", loginController.handleLogin);
router.post("/users", registerController.createUser);
router.post("/users/comment", commentController.comment);
router.post("/cart/add", cartController.addToCart);

router.put("/address", customerController.updateAddress);
router.put("/customer", customerController.updateCustomer);

router.delete("/cart/item", cartController.removeItem);

module.exports = router;
