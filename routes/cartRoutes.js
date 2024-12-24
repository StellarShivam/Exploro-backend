const express = require("express");
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, cartController.addToCart);
router.get("/getCart", protect, cartController.getCart);
router.delete("/item/:itemId", protect, cartController.removeFromCart);

module.exports = router;
