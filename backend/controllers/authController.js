const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const { User } = require("../models");  // Import User model
const jwt = require('jsonwebtoken');  // Import JWT for token generation
const { validationResult } = require('express-validator');  // Import validation middleware

// Login method
exports.login = async (req, res) => {
  const { email, password } = req.body;  // Now using 'email' instead of 'username'

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Find user by email (not username)
    const user = await User.findOne({ where: { email } });  // Change username to email

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a JWT token after successful login
    const token = jwt.sign(
      { id: user.id, email: user.email },  // Payload uses 'email' now
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
    });
    console.log(token);
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Signup method
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Check if the email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists. Please use a different email.' });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken. Please choose another username.' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    // Create a new user with the hashed password
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
