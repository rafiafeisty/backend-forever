const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("../routes/auth");
const serverless = require("serverless-http");
require("dotenv").config();

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

app.use("/auth", authRoutes);

// Export only handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
