// const axios = require('axios');
// const orderDb = require('../models/order');
// const jwt = require('jsonwebtoken');
// const cashfreeConfig = require('../config/cashfreeConfig');

// // Buy Premium Feature 
// exports.getPremium = async (req, res) => {
//     try {
//       const orderId = `order_${Date.now()}`;
//       const amount = 100;
  
//       const response = await axios.post(
//         cashfreeConfig.CASHFREE_URL,
//         {
//           order_id: orderId,
//           order_amount: amount,
//           order_currency: "INR",
//           customer_details: {
//             customer_id: req.user.id,
//             customer_name: req.user.name,
//             customer_email: req.user.email,
//           },
//           order_meta: {
//             return_url: `http://localhost:3000/purchase/status?order_id=${orderId}`
//             //notify_url: `http://localhost:3000/purchase/webhook`
//           }
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-version": "2022-09-01",
//             "x-client-id": process.env.CASHFREE_APP_ID,
//             "x-client-secret": process.env.CASHFREE_SECRET_KEY
//           }
//         }
//       );
  
//       const paymentLink = response.data.payment_link;
//       res.json({ paymentLink });
//     } catch (err) {
//       console.error(err.response?.data || err);
//       res.status(500).json({ message: "Payment initiation failed" });
//     }
//   };
  
//   exports.handleReturn = async (req, res) => {
//     const { order_id } = req.query;
//     res.send(`<h1>Payment processed. Order ID: ${order_id}</h1>`);
//   };
  
// //   exports.handleWebhook = async (req, res) => {
// //     try {
// //       const { order_id, order_status, payment_id } = req.body;
  
// //       if (order_status === "PAID") {
// //         // Update user's premium status in DB (pseudo code)
// //         await User.update(
// //           { isPremium: true },
// //           { where: { id: req.body.customer_details.customer_id } }
// //         );
// //       }
  
// //       res.status(200).send("OK");
// //     } catch (error) {
// //       console.error("Webhook error:", error);
// //       res.status(500).send("Internal Server Error");
// //     }
// //   };

// // Update Premium Status ,Failure or Success
// exports.updatePremium = async (req, res, next) => {
//     try {
//         const paymentid = req.body.payment_id;
//         const orderid = req.body.order_id;

//         const result = await orderDb.findOne({ where: { orderId: orderid } });

//         if (paymentid === null) {
//             res.json({ message: "Payment Failed" });
//             return result.update({ paymentId: paymentid, status: "FAILED" });
//         }

//         // Update payment and user status for successful payment
//         await Promise.all([
//             result.update({ paymentId: paymentid, status: "SUCCESS" }),
//             req.user.update({ ispremiumUser: true })
//         ]);

//         const token = generateToken(req.user.id, true);
//         res.json({ success: true, message: "Premium Purchased Successfully", token });
//     } catch (err) {
//         console.log("Error in updating transaction", err);
//         res.json({ Error: err });
//     }
// };

// function generateToken(id, isPremiumUser) {
//     return jwt.sign({ userId: id, isPremium: isPremiumUser }, process.env.JWT_SECRET);
// }
