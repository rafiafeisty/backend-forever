const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("../routes/auth");
const serverless = require("serverless-http");
require("dotenv").config();
const {Order}=require("../models/User")
const {Item}=require("../models/User")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB (guard against multiple connections in serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.item_id"); // populate item details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get('/display',async(req,res)=>{
    const all=await Item.find()
    res.status(201).json(all)
})

app.use("/auth", authRoutes);

// Export only handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
