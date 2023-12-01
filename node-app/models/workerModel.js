const mongoose = require('mongoose');

const validRoles = ['admin', 'waiter', 'cook'];

function validateRole(value) {
  return validRoles.includes(value);
}
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
        validator: validateRole,
        message: 'Invalid role'
      }
    }
  });
  
  // Модель категорій робітників
  const Workers = mongoose.model('Worker', workers, 'workers');
module.exports = { Workers };