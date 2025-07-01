const express = require('express');
const router = express.Router();
const { showLeaderboard } = require('../controllers/premiumController');
const authenticate = require('../middleware/authenticate');

router.get('/showleaderboard', authenticate, showLeaderboard);

module.exports = router;
