const mongoose = require('mongoose');
// Схема для користувачів
const users = new mongoose.Schema({
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
          // Ваша власна логіка перевірки для електронної пошти
          return /\S+@\S+\.\S+/.test(value);
        },
        message: 'Неправильний формат електронної пошти'
      }
    },
    password: String,
  });
  
  
  // Модель категорій користувачів
  const Users = mongoose.model('Users', users, 'users');
module.exports = { Users };