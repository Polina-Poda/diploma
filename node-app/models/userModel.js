const mongoose = require('mongoose');

// Схема для користувачів
const users = new mongoose.Schema({
    userName: String,
    email: {
      type: String,
      validate: {
        validator: function(value) {
          // Ваша власна логіка перевірки для електронної пошти
          return /\S+@\S+\.\S+/.test(value);
        },
        message: 'Incorrect email format'
      }
    },
    password: String,
    hashPassword: String,
    role:String
  });
  
  // Модель категорій користувачів
  const Users = mongoose.model('Users', users, 'users');
module.exports = { Users };