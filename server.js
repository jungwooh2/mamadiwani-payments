const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require("stripe");

// ✅ Your Stripe secret key
const stripe = Stripe("sk_test_51SEK8KDQvlbXn5W4R83wFy6zNptPgWBQjmzXjs9hSbxkqd7FPW0JOJvPDbVYtTIb1EFuNvLIoJzNSBD9UB3BgVeO000rKeizdu");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Step 4: Stripe Checkout session route
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Safari Booking Deposit"
          },
          unit_amount: 20000 // $200 in cents
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: "https://mamadiwani-safari.netlify.app/success",
      cancel_url: "https://mamadiwani-safari.netlify.app/cancel"
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Real payment route
app.post("/payments", async (req, res) => {
  const { amount, customerId, method, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe uses cents
      currency: "usd",
      source: token,         // This comes from Stripe.js frontend
      description: `Safari booking for ${customerId}`
    });

    res.json({
      message: "✅ Real payment confirmed",
      transactionId: charge.id,
      amount,
      method,
      customerId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Payments backend running on port ${PORT}`));
