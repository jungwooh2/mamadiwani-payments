const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/payments", async (req, res) => {
  const { amount, customerId, method, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      source: token,
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
