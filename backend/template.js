const htmlTemp = (orderId, status, amount) => {
    return `
      <html>
        <head><title>Payment ${status}</title></head>
        <body>
          <h1>Payment Status: ${status}</h1>
          <h2>Order ID: ${orderId}</h2>
          <h2>Amount: ₹${amount}</h2>
          ${
            status === "Success"
              ? `<button onclick="upgradeUser()">Upgrade to Premium</button>
                 <script>
                   async function upgradeUser() {
                     const token = localStorage.getItem("token"); // Assuming JWT is stored
                     const res = await fetch("/user/upgrade", {
                       method: "POST",
                       headers: {
                         "Content-Type": "application/json",
                         "Authorization": "Bearer " + token,
                       },
                     });
  
                     const data = await res.json();
                     alert(data.message);
                   }
                 </script>`
              : ""
          }
        </body>
      </html>
    `;
  };
  