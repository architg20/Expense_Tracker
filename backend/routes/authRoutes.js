const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Import the authController

// Route for handling signup
router.post('/signup', authController.signup);

//Route for handling login
router.post('/login', authController.login);
// You can add more authentication routes here (login, etc.)

module.exports = router;
