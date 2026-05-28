const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { getAllContacts } = require("../controllers/contactController");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");
const { uploadMultipleImages } = require("../middlewares/uploadMiddleware");

router.use(authenticateToken);
router.use(authorizeRole("admin"));

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

router.get("/orders", adminController.getAllOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

router.post("/tours", adminController.createTour);
router.put("/tours/:id", adminController.updateTour);
router.delete("/tours/:id", adminController.deleteTour);
router.post("/upload-images", uploadMultipleImages("images"), adminController.uploadTourImages);

router.get("/contacts", getAllContacts);

module.exports = router;
