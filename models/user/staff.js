const mongoose = require('mongoose');
const User = require('./user');

const staffSchema = new mongoose.Schema({
  address: {
    type: String
  },
  ssn: {
    type: String
  }
});

module.exports = User.discriminator('Staff', staffSchema);