const jwt = require('jsonwebtoken');
const { User } = require('../models');  // Ensure that this is correctly importing the User model


module.exports = async (req, res, next) => {
  // Get the token from the Authorization header (Expecting format "Bearer <token>")
  const token = req.header('Authorization')?.split(' ')[1];  // Split to get the token part

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied. No Token Provided.' });
  }

  try {
    // Verify the token using the same secret key as during login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the secret from environment variables

    // Find the user in the database based on the decoded user id from the token
    
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }

    // Attach the user to the request object for future use in the next middleware or route handler
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    console.error(err);
    res.status(400).json({ success: false, message: 'Invalid Token' });
  }
};
