const mongoose = require('mongoose');

// Схема для користувачів
const tokens = new mongoose.Schema({
    email: String,    
    token: String
  });
  
  // Модель категорій користувачів
  const Tokens = mongoose.model('Tokens', tokens, 'tokens');
module.exports = { Tokens };