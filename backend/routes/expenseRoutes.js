const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate'); // To verify JWT

// Add expense
router.post('/add', authenticate, expenseController.addExpense);

// Get expenses
router.get('/get', authenticate, expenseController.getExpenses);

// Delete expense
router.delete('/delete/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
