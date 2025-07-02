const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Adjust the path if necessary
const authRoutes = require('./routes/authRoutes'); // Import routes for handling login/signup
const expenseRoutes = require('./routes/expenseRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes
const premiumRoutes = require('./routes/premiumRoutes');
const passwordRoutes = require('./routes/password');


const fs = require('fs');
const morgan = require('morgan');



const PORT = process.env.PORT || 3000;



require('dotenv').config();


require('./models/user');
require('./models/payment');
require('./models/expense');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // For handling URL-encoded data (like form submissions)
app.use(express.json()); // Add this to handle JSON data
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files from 'views' folder
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/auth', authRoutes); 
app.use('/expense', expenseRoutes); 
app.use('/payment', paymentRoutes); 
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);


//Logging using morgan
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' } // append mode
);

app.use(morgan('combined', { stream: accessLogStream }));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')); 
});


app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html')); // Serve signup page at '/signup'
});

app.get('/payment-failed', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment-failed.html'));
});

app.get('/expense', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

const errorLogStream = fs.createWriteStream(
  path.join(__dirname, 'errors.log'),
  { flags: 'a' }
);

app.use((err, req, res, next) => {
  const errorMsg = `[${new Date().toISOString()}] ${err.stack}\n`;
  errorLogStream.write(errorMsg);
  res.status(500).json({ message: 'Something went wrong!' });
});



// Start the server after syncing the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port {PORT}`);
});