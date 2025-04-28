const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('./models/user'); // Import User model, adjust if necessary
const expenseRoutes = require('./routes/expenseRoutes'); 
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // for handling URL-encoded data (like form submissions)
app.use(express.json()); // Add this to handle JSON data
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files from 'views' folder

// Routes
const authRoutes = require('./routes/authRoutes'); // Import routes for handling login/signup
app.use('/auth', authRoutes);


// Serve the login page by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')); // Serve login page at '/'
});

// Serve the signup page when visiting '/signup'
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html')); // Serve signup page at '/signup'
});

// Expense Routes
app.use('/expense', expenseRoutes);

app.use('/purchase', purchaseRoutes);
// Database setup and syncing
const sequelize = require('./config/database'); // Adjust the path if necessary

// Start the server after syncing the database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Your route handlers and middleware go here

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});