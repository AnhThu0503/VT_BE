const express = require("express");
const stripe = require("stripe")(
  "sk_test_51OxTc1RxWukTEIoIiSl5HKASXZVguM2tdPjPAGkEKgHMtTvZaNndgJVGUqRVLPq1sSvs6OfPvDvXBjDXfVnmVGDY00BKZ5p1eX"
);
const productController = require("../../controllers/customer-controllers/product");
const categoryController = require("../../controllers/customer-controllers/category");
const registerController = require("../../controllers/customer-controllers/register");
const loginController = require("../../controllers/customer-controllers/login");
const cartController = require("../../controllers/customer-controllers/cart");
const orderController = require("../../controllers/customer-controllers/order");
const customerController = require("../../controllers/customer-controllers/customer");
const commentController = require("../../controllers/customer-controllers/commt");
const blogController = require("../../controllers/customer-controllers/blog");
const router = express.Router();

router.get("/blogs", blogController.getAllBlog);
router.get("/product-all", productController.getProductAll);
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
router.get("/order-customer", orderController.getOrdersOfCustomer);
router.get("/products-discount", productController.getProductDiscount);
router.get("/products-discount-all", productController.getAllProductDiscount);
router.get("/products-bestseller", productController.getAllProductBanChay);
router.post("/products/search", productController.searchProduct);
router.post("/order", orderController.createOrder);
router.post("/login", loginController.handleLogin);
router.post("/users", registerController.createUser);
router.post("/users/comment", commentController.comment);
router.post("/cart/add", cartController.addToCart);

// handle session online payment
router.post("/paymentOnline", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "vnd",
      product_data: {
        name: product.SP_ten,
        images: [product.image],
      },
      unit_amount: Math.round(product.G_thoiGia),
    },
    quantity: product.soLuong,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});
router.put("/order/update", orderController.updateStatusOrder);
router.put("/address", customerController.updateAddress);
router.put("/customer", customerController.updateCustomer);
router.delete("/cart/item", cartController.removeItem);

module.exports = router;
