const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  getPaymentPage,
  processPayment,
  getPaymentStatus,
} = require("../controllers/paymentController");

router.get("/p", authenticate,getPaymentPage);
router.post("/pay",authenticate, processPayment);
router.get("/payment-status/:paymentSessionId",authenticate, getPaymentStatus);

module.exports = router;
