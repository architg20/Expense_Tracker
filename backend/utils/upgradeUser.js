const User = require('../models/user');


async function upgradeUserToPremium(userId) {
   try {
    const user = await User.findByPk(userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found.`);
      return null;
    }

    user.premium = true;
    await user.save();

    console.log(`User ${user.username} upgraded to premium.`);
    return user; 
  } catch (error) {
    console.error("Error upgrading user to premium:", error.message);
    return null;
  }
}

module.exports = upgradeUserToPremium;
