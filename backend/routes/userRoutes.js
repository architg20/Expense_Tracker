const express = require('express');
const router = express.Router();
const { upgradeToPremium } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware'); // assuming JWT/session

router.post('/upgrade', authenticate, upgradeToPremium);
// routes/userRoutes.js
router.get('/me', authenticate, getUserDetails);

module.exports = router;
