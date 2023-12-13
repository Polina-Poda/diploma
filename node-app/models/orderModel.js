const mongoose = require('mongoose');

// Схема для страв
const orderSchema = new mongoose.Schema({
  items: [{
    idMenuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    _id: false,
    priceMenuItem: Number,
    nameMenuItem: String,
  }],
  price: Number,
  chef: String,
  waiter: String,
  user: String,  
});

// Модель категорій страв
const Order = mongoose.model('Order', orderSchema, 'order');

module.exports = { Order };
