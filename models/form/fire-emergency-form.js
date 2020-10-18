const mongoose = require('mongoose');
const ConsumerForm = require('./consumer-form');
const generalUtils = require('../../utils/generals');

const FireEmergencyFormSchema = new mongoose.Schema({

  address: {
    type: String,
    required: [true, 'Form must have an address']
  },
  res_type: {
    type: String,
    required: [true, 'Form must have a resource Type']
  },
  official_name: {
    type: String
  },
  begin_time: {
    type: String
  },
  end_time: {
    type: String
  },
  persons_evacuated:{
    type: Number
  },
  fire_location:{
    type: String
  },
  follow_up:{
    type: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true}
});

FireEmergencyFormSchema.virtual('total_time').get(function(){
  return generalUtils.getTimeDifference(this.begin_time, this.end_time);
});

module.exports = ConsumerForm.discriminator('FireEmergencyForm', FireEmergencyFormSchema);