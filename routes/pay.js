const express = require("express");
const router = express.Router();

const Offer = require("../models/Offer");
const Sold = require("../models/Sold");

const stripe = require("stripe")(process.env.STRIPE_SK);

router.post("/pay", async (req, res) => {
  const stripeToken = req.body.stripeToken;

  // console.log(stripeToken);
  // console.log(req.body.amount);
  const response = await stripe.charges.create({
    amount: Number((req.body.amount * 100).toFixed(2)),
    currency: "eur",
    description: req.body.title,
    source: stripeToken,
  });

  console.log(response.status);

  //   sold.push(response);
  //   offers.remove(response);

  res.json(response);
});

module.exports = router;
