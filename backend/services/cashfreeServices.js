const { Cashfree, CFEnvironment } = require("cashfree-pg");
require("dotenv").config();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

exports.createOrderInCashfree = async ({ orderId, orderAmount, orderCurrency, customerID, customerPhone }) => {
  const request = {
    order_id: orderId,
    order_amount: Number(orderAmount),
    order_currency: orderCurrency || "INR",
    customer_details: {
      customer_id: String(customerID),
      customer_phone: customerPhone,
    },
    order_meta: {
      return_url: `http://localhost:3000/payment/status/${orderId}`,
    },
  };
  
  console.log("Sending order creation request to Cashfree:\n", request);

  try {
    const response = await cashfree.PGCreateOrder(request);
    return response.data;
  } catch (error) {
    console.error("Cashfree API error:", error.response?.data || error.message);
    throw error;
  }
};

exports.fetchOrderStatusFromCashfree = async (orderId) => {
  const response = await cashfree.PGFetchOrder(orderId);
  return response.data;
};
