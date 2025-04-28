const Cashfree = require('axios');
const orderDb = require('../models/order');
const jwt = require('jsonwebtoken');
const cashfreeConfig = require('../config/cashfreeConfig');

// Get Premium (Create Order on Cashfree)
exports.getPremium = async (req, res, next) => {
    try {
        const amount = 2000;  // Example amount for premium purchase (in INR)
        
        const response = await Cashfree.post(cashfreeConfig.CASHFREE_URL, {
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_name: req.user.name,
                customer_email: req.user.email,
                customer_phone: req.user.phone
            }
        });

        const order = response.data;

        // Store order in the database with status PENDING
        await orderDb.create({
            orderId: order.order_id,
            status: "PENDING",
            userId: req.user.id
        });

        res.json({ order, key_id: cashfreeConfig.CASHFREE_KEY_ID });
    } catch (err) {
        console.log("Cashfree error", err);
        res.json({ Error: err });
    }
};

// Update Premium Status (after Payment Success/Failure)
exports.updatePremium = async (req, res, next) => {
    try {
        const paymentid = req.body.payment_id;
        const orderid = req.body.order_id;

        const result = await orderDb.findOne({ where: { orderId: orderid } });

        if (paymentid === null) {
            res.json({ message: "Payment Failed" });
            return result.update({ paymentId: paymentid, status: "FAILED" });
        }

        // Update payment and user status for successful payment
        await Promise.all([
            result.update({ paymentId: paymentid, status: "SUCCESS" }),
            req.user.update({ ispremiumUser: true })
        ]);

        const token = generateToken(req.user.id, true);
        res.json({ success: true, message: "Premium Purchased Successfully", token });
    } catch (err) {
        console.log("Error in updating transaction", err);
        res.json({ Error: err });
    }
};

function generateToken(id, isPremiumUser) {
    return jwt.sign({ userId: id, isPremium: isPremiumUser }, 'secretKey');
}
