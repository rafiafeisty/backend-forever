const express = require("express");
const multer = require("multer");
const {Item}=require('../models/User')
const {Order}=require('../models/User')
const {Login}=require('../models/User')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, subcategory, price } = req.body;

    const newProduct = new Item({
      name,
      description,
      category,
      subcategory,
      price,
      image: req.file ? req.file.buffer.toString("base64") : null, 
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/addbulk", async (req, res) => {
  try {
    const items = req.body; 

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Expected an array of items" });
    }

    const insertedItems = await Item.insertMany(items);
    res.status(201).json({ 
      message: "Products added successfully", 
      count: insertedItems.length,
      products: insertedItems 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/display',async(req,res)=>{
    const all=await Item.find()
    res.status(201).json(all)
})
router.get('/detail/:id',async(req,res)=>{
    const {id}=req.params
    const exist=await Item.findById(id)
    if(!exist){
        res.status(400).json("no item exist")
    }
    else{
        res.status(201).json(exist)
    }
})

router.delete('/del', async (req, res) => {
  try {
    const { id } = req.body;

    const exist = await Item.findById(id);
    if (!exist) {
      return res.status(404).json("No item exists");
    }

    await Item.deleteOne({ _id: id }); 
    res.status(200).json("Item deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

router.post('/order',async(req,res)=>{
  const {customer_name,items,total,date,status}=req.body
  const neworder=new Order({
    customer_name,
      items,
      total,
      status
  })
  await neworder.save()
   res.status(201).json("Order placed successfully");
})

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.item_id"); // populate item details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.delete('/delorder',async(req,res)=>{
  const {id}=req.body
  const exist=await Order.findById(id)
  if(!exist){
    req.status(400).json("no order exist")
  }
  else{
    await Order.deleteOne({ _id: id})
    res.status(201).json("order deleted successfully")
  }
})

router.put("/updateorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const exist = await Order.findById(id);
    if (!exist) {
      return res.status(404).json({ message: "Order not found" });
    }

    exist.status = status;
    await exist.save();

    res.status(200).json({ message: "Order status updated successfully", order: exist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register",async(req,res)=>{
  const {username,password}=req.body
  const exist=await Login.findOne({username})
  if(exist){
    res.status(400).json("user already exists")
  }
  else{
    const hashedpass=await bcrypt.hash(password,10)
    const newuser=new Login({username,password:hashedpass})
    await newuser.save()
    res.status(201).json("user saved successfully")
  }
})

router.post("/login",async(req,res)=>{
  const {username,password}=req.body
  const exist=await Login.findOne({username})
  if(!exist){
    res.status(400).json("No user exists")
  }
  else{
    const match=await bcrypt.compare(password,exist.password)
    if(!match){
      res.status(400).json("Invalid credentials")
    }
    else{
      const token=jwt.sign(
        {id:exist._id},
        process.env.JWT_SECRET,
        {expiresIn:'2h'}
      )
      res.status(201).json({
        token,
        message:"Logged in sucessfully"
      })
    }
  }
})
router.post("/adminlog",async(req,res)=>{
  const {username,password}=req.body
  const exist=await Login.findOne({username})
  if(!exist){
    res.status(400).json("No user exists")
  }
  else{
    const match=await bcrypt.compare(password,exist.password)
    if(!match){
      res.status(400).json("Invalid credentials")
    }
    else{
      const token=jwt.sign(
        {id:exist._id},
        process.env.JWT_SECRET,
        {expiresIn:'2h'}
      )
      res.status(201).json({
        token,
        message:"Logged in sucessfully"
      })
    }
  }
})


module.exports = router;
