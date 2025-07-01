const cashfree = Cashfree({
    mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    // Fetch payment session ID from backend
    console.log("Initiating payment...");
    const token = localStorage.getItem('token');

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const customerID = decodedToken.id;

    const response = await fetch("http://localhost:3000/payment/pay", {
      method: "POST",  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` 
  },
        body: JSON.stringify({
        orderAmount: 2000,
        orderCurrency: "INR",
        customerID,
        customerPhone: "9999999999"
      })
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;
    const orderId = data.orderId; 

    // Initialize checkout options
    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
      
      //? New page payment options
        redirectTarget: "_self", // (default)
    };

    // Start the checkout process
    await cashfree.checkout(checkoutOptions);

    const statusRes = await fetch(`http://localhost:3000/payment/status/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const statusData = await statusRes.json();

    if (statusData.token) {
      // Step 3: Store new premium token
      localStorage.setItem('token', statusData.token);
      alert(" Payment successful! You're now a premium user.");
      window.location.href = "expense.html";
    } else {
      alert(" Payment failed or not verified.");
      window.location.href = "payment-failure.html";
    }

  } catch (err) {
    console.error("Error:", err);
  }
});