const mongoose = require('mongoose');
const ConsumerForm = require('./consumer-form');

const hotWaterFireFormSchema = new mongoose.Schema({

  address: {
    type: String,
    required: [true, 'Form must have an address']
  },
  res_type: {
    type: String,
    required: [true, 'Form must have a resource Type']
  },
  strengths: {
    type: String
  },
  needs: {
    type: String
  },
  recommendations: {
    type: String
  },
  questions:[
    {
      question: {type: String},
      answer: {type: String, enum: ['Physical assistance', 'Verbal prompting', 'Independently']}
    }
  ]
});

module.exports = ConsumerForm.discriminator('HotWaterFireForm', hotWaterFireFormSchema);