const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const ForgotPasswordRequest = require('../models/ForgotPasswordRequest');
const bcrypt = require('bcrypt');


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_MAIL,
        pass: process.env.BREVO_PASS,
      },
    });

    const resetId = uuidv4(); // generate UUID

    await ForgotPasswordRequest.create({
      id: resetId,
      UserId: user.id,
      isActive: true
    });



    const resetLink = `http://localhost:3000/password/resetpassword/${resetId}`;

    const mailOptions = {
      from: `"Expense App" architwm1@gmail.com`, 
      to: email,
      subject: 'Password Reset Request',
       text: `This is a test. Link: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getResetPassword = async (req, res) => {
  const { resetId } = req.params;

  try {
    const resetRequest = await ForgotPasswordRequest.findOne({ where: { id: resetId, isActive: true } });

    if (!resetRequest) {
      return res.status(400).send('Reset link is invalid or expired.');
    }

    // Optional: return a basic form from backend if not using frontend
    res.send(`
      <form action="/password/updatepassword/${resetId}" method="POST">
        <input type="password" name="newPassword" placeholder="Enter new password" required />
        <button type="submit">Reset Password</button>
      </form>
    `);
  } catch (error) {
    res.status(500).send('Server error');
  }
};



exports.updatePassword = async (req, res) => {
  const { resetId } = req.params;
  const { newPassword } = req.body;

  try {
    const resetRequest = await ForgotPasswordRequest.findOne({ where: { id: resetId, isActive: true } });

    if (!resetRequest) {
      return res.status(400).send('Reset link is invalid or expired.');
    }

    const user = await User.findByPk(resetRequest.UserId);
    if (!user) return res.status(404).send('User not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetRequest.isActive = false;
    await resetRequest.save();

    //res.send('Password successfully updated');
    res.send(`
  <script>
    alert("Password updated successfully");
    window.location.href = "/";
  </script>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
