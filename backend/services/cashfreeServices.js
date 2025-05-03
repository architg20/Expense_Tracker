// const { Cashfree } = require("cashfree-pg");

// Cashfree.XClientId = process.env.CASHFREE_APP_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
// Cashfree.XEnvironment = "SANDBOX";

// exports.createOrder = async (
//   orderId,
//   orderAmount,
//   orderCurrency="IND",
//   customerID,
//   customerPhone
// ) => {
//   try {

//     const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
//     const formattedExpiryDate = expiryDate.toISOString();

//     const request = {
//       order_amount: orderAmount,
//       order_currency: orderCurrency,
//       order_id: orderId,
      
//       customer_details: {
//         customer_id: customerID,  
//         customer_phone: customerPhone,
//       },

//       order_meta: {
//         return_url: `http://localhost:3000/payment-status/${orderId}`, //? calling getPaymentStatus
//         payment_methods: "ccc, upi, nb"
//       },
//       order_expiry_time: formattedExpiryDate, //!? Set the valid expiry date
//     };

//     const response = await Cashfree.PGCreateOrder("2025-05-01", request);

//     return response.data.payment_session_id;
//   } catch (error) {
//     console.error("Error creating order:", error.message);
//   }
// };


// exports.getPaymentStatus = async (orderId) => {
//   try {

//     const response = await Cashfree.PGOrderFetchPayments("2025-05-01", orderId);

//     let getOrderResponse = response.data;
//     let orderStatus;

//     if (
//       getOrderResponse.filter(
//         (transaction) => transaction.payment_status === "SUCCESS"
//       ).length > 0
//     ) {
//       orderStatus = "Success"; 
//     } else if (
//       getOrderResponse.filter(
//         (transaction) => transaction.payment_status === "PENDING"
//       ).length > 0
//     ) {
//       orderStatus = "Pending"; 
//     } else {
//       orderStatus = "Failure";
//     }

//     return orderStatus;
    
//   } catch (error) {
//     console.error("Error fetching order status:", error.message);
//   }
// };

