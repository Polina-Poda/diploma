const mongoose = require('mongoose');

const validRoles = ['admin', 'waiter', 'cook'];
// Схема для робітників
const workers = new mongoose.Schema({
   workerFirstName: String,
   workerSecondName: String,
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
    role: {
      type: String,
      validate: {
        validator: function(value) {
          // Перевірте, чи значення входить до допустимого переліку ролей
          return validRoles.includes(value);
        },
        message: 'Invalid role'
      }
    }
  });
  
  // Модель категорій робітників
  const Workers = mongoose.model('Worker', workers, 'workers');
module.exports = { Workers };