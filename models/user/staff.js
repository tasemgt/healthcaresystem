const mongoose = require('mongoose');
const User = require('./user');

const staffSchema = new mongoose.Schema({
  address: {
    type: String
  },
  ssn: {
    type: String
  },
  employment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmploymentForm',
    required: [true, 'An Approved Application is required before registering a user'],
  }
});

module.exports = User.discriminator('Staff', staffSchema);