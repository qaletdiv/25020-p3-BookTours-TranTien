const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");

router.use(authenticateToken);

router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);

module.exports = router;
