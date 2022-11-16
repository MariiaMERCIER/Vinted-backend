const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI);

const usersRoutes = require("./routes/users");

app.use(usersRoutes);
const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

const payRoutes = require("./routes/pay");
app.use(payRoutes);

app.all("*", (req, res) => {
  res.json({ message: "No route with this name" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
