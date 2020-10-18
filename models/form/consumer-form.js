const mongoose = require('mongoose');

const formOptions = {
  discriminatorKey: 'recordType', // our discriminator key, could be anything
  collection: 'consumerforms', // the name of our collection 
};

const ConsumerFormSchema = new mongoose.Schema({
  form_name: {
    type: String,
    required: [true, 'A Form must have a name']
  },
  consumer_name:{
    type: String,
    required: [true, 'A Form must have a consumer name']
  },
  dateOfAppointment: {
    type: Date,
    required: [true, 'A Form must have an appointment date']
  },
  date: {
    type: Date,
    default: new Date()
  },
  lc_num:{
    type: String,
    required: [true, 'A Form must have an LC Number']
  },
  signatory:{
    type: String,
    required: [true, 'A Form must have an LC Number']
  }
}, formOptions);

module.exports = mongoose.model('ConsumerForm', ConsumerFormSchema);