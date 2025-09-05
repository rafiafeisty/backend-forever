const mongoose = require("mongoose");

const Itemsschema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, 
});

const OrderItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const Orderschema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true }, 
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true}
});

const LoginSchema=new mongoose.Schema({
  username:{type:String,required:true},
  password:{type:String,required:true}
})

const Item = mongoose.model("Item", Itemsschema);
const Order = mongoose.model("Order", Orderschema);
const Login=mongoose.model("Login",LoginSchema)

module.exports = { Item, Order,Login };