const mongoose = require('mongoose');

// Схема для категорій страв
const categorySchema = new mongoose.Schema({
  name: String,
});


// Модель категорій страв
const Category = mongoose.model('Category', categorySchema, 'category');

// Схема для страв
const menuItemSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  calories: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

// Модель страв
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = { Category, MenuItem };
