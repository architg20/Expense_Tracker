const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/forgotPassword');

router.post('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:resetId', passwordController.getResetPassword); 
router.post('/updatepassword/:resetId', passwordController.updatePassword); 

module.exports = router;
