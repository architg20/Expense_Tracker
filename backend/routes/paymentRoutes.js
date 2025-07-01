const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Middleware for authentication
const paymentController = require("../controllers/paymentController");

// Route to create a payment session
router.post("/pay", authenticate, paymentController.initPayment);

// Route to get payment status by orderId
router.get("/status/:orderId", paymentController.getPaymentStatus);

router.post('/test', (req, res) => {
  console.log("BODY:", req.body);
  res.json({ received: req.body });
});

module.exports = router;