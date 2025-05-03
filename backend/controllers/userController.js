const User = require('../models/userModel');

exports.upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user is authenticated
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isPremium = true;
    await user.save();

    res.json({ message: 'User upgraded to premium successfully' });
  } catch (error) {
    console.error('Error upgrading user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// controllers/userController.js
exports.getUserDetails = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id); // Assuming req.user is set by auth middleware
  
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user details' });
    }
  };
  
