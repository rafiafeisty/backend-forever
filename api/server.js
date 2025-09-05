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
app.use("/uploads", express.static("uploads")); 

// Connect DB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/auth", authRoutes);


module.exports = app;
module.exports.handler = serverless(app);
