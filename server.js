const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/payments', (req, res) => {
  const { amount, customerId, method } = req.body;

  if (!amount || !customerId || !method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transactionId = 'TXN-' + Date.now();
  res.status(200).json({
    message: 'Deposit confirmed',
    transactionId,
    amount,
    method,
    customerId
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Payments backend running on port ${PORT}`));
