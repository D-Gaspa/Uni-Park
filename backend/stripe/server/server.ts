import express from 'express';
import Stripe from 'stripe';

const app = express();

// This is your test secret API key.
const stripe = new Stripe('sk_test_51PAdx8P3rEHNvqwVHurQAs7zDxkwfipRCrBW3ftSX36ahNBLY0M9vKyBrrHRCHczTpXfr1hctWU3yeXvZNicnbqM00tTVo7eS5', {
  apiVersion: '2024-04-10'
});

app.use(express.static("public"));
app.use(express.json());

interface Item {
  id: string;
  quantity: number;
}

const calculateOrderAmount = (items: Item[]): number => {
  return 25;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body as { items: Item[] };

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "mxn",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));
