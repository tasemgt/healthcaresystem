const mongoose = require('mongoose');
const validator = require('validator');

const consumerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A consumer must have a first name']
  },
  lastName: {
    type: String,
    required: [true, 'A consumer must have a last name']
  },
  email: {
    type: String,
    required: [true, 'A consumer must have an email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  lcNumber:{
    type: String,
    required: [true, 'A consumer must have a Local Case Number'],
    unique: true
  },
  phone: { 
    type: String,
    required: [true, 'A consumer must have a last name']
  }
});

module.exports = mongoose.model('Consumer', consumerSchema);