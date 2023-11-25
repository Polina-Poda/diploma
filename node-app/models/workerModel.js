const mongoose = require('mongoose');

// Схема для користувачів
const workers = new mongoose.Schema({
   workerName: String,
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
    hashPassword: String,
    role:String
  });
  
  // Модель категорій користувачів
  const Worker = mongoose.model('Worker', workers, 'worker');
module.exports = { Worker };