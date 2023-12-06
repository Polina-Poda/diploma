const mongoose = require('mongoose');

function validateRole(value) {
  return validRoles.includes(value);
}
// Схема для робітників
const workers = new mongoose.Schema({
   workerFirstName: String,
   workerLastName: String,
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
    role: String
  });
  
  // Модель категорій робітників
  const Workers = mongoose.model('Worker', workers, 'workers');
module.exports = { Workers };