const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticate = require('../middleware/authenticate');

//Route to initiate premium purchase (get order)
router.get('/premium-membership', authenticate, purchaseController.getPremium);

// Route to handle the transaction status (payment success/failure)
router.post('/updateTransactionStatus', authenticate, purchaseController.updatePremium);
// router.get('/status', authenticate,purchaseController.handleReturn);
// router.post('/webhook',authenticate, purchaseController.handleWebhook);
module.exports = router;
