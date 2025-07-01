const { createOrderInCashfree, fetchOrderStatusFromCashfree } = require("../services/cashfreeServices");
const Payment = require("../models/payment");
const upgradeUserToPremium = require("../utils/upgradeUser");
//const User = require("../models/user");
const jwt = require('jsonwebtoken');

exports.initPayment = async (req, res) => {
  const { orderAmount, orderCurrency, customerID, customerPhone } = req.body;
  const orderId = "ORDER_" + Date.now();
  console.log("Request Body:", req.body);
  try {
    const response = await createOrderInCashfree({
      orderId,
      orderAmount,
      orderCurrency,
      customerID:String(customerID),
      customerPhone,

    });

    await Payment.create({
      orderId,
      paymentSessionId: response.payment_session_id,
      orderAmount,
      orderCurrency,
      paymentStatus: "PENDING",
      userId: req.user.id,
    });
    console.log("req.user in initPayment:", req.user);

    res.status(200).json({
      orderId,
      paymentSessionId: response.payment_session_id
    });
  } catch (error) {
    console.error("Cashfree order creation failed.");
    console.error("Error message:", error.message);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  console.log("🔔 getPaymentStatus route triggered");
  const { orderId } = req.params;

  try {
    const order = await Payment.findOne({ where: { orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const response = await fetchOrderStatusFromCashfree(orderId);
    order.paymentStatus = response.order_status;
    await order.save();
    console.log(response.order_status)
    if (response.order_status === "PAID") {
      // Redirect to expense dashboard
      
      console.log("Paid");
       const upgraded = await upgradeUserToPremium(order.userId);
       if (!upgraded) {
        console.warn("⚠️ Failed to upgrade user.");
        }

        const newToken = jwt.sign(
  {
    id: upgraded.id,
    email: upgraded.email,
    username: upgraded.username,
    premium: upgraded.premium
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

return res.redirect(`/payment-success.html?token=${newToken}`);

      // console.log("Order details:", order);
      // console.log("User ID on this order:", order.userId);
      // const user = await User.findByPk(order.userId);
      // console.log(user);
      // if (user) {
      //   user.premium = true;
      //   await user.save();
      //   console.log("🌟 User upgraded to premium.");
      // } else {
      //   console.warn("⚠️ User not found for this order.");
      // }


      //return res.redirect('/expense');

    } else {
      // Redirect to payment failed page
      return res.redirect('payment-failure');
    }


    //res.status(200).json({ orderStatus: response.order_status });
  } catch (error) {
    console.error("Error fetching payment status:", error.message);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};
