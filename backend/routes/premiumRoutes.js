const express = require('express');
const router = express.Router();
const { showLeaderboard, downloadExpenses } = require('../controllers/premiumController');
const authenticate = require('../middleware/authenticate');

router.get('/showleaderboard', authenticate, showLeaderboard);
router.get('/download', authenticate, downloadExpenses);
module.exports = router;
