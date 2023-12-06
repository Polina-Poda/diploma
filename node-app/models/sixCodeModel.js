const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const Code = mongoose.model('Code', codeSchema, 'login_code');

module.exports = {Code};
