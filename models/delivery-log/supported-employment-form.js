const mongoose = require('mongoose');

const supportedEmploymentSchema = new mongoose.Schema({
  consumer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consumer',
    required: [true, 'A consumer is required']
  },
  lcNumber: {
    type: String,
    required: [true, 'Local Case Number of Service is required']
  },
  records:[
    {
      dateOfService: {
        type: Date,
        required: [true, 'Service date is required']
      },
      beginTime: {
       morning: {type: String, required: [true, 'Morning Begin time is required']},
       evening: {type: String, required: [true, 'Evening Begin time is required']}
      },
      endTime: {
        morning: {type: String, required: [true, 'Morning End time is required']},
        evening: {type: String, required: [true, 'Evening End time is required']}
      },
      location: {
        type: String,
        required: [true, 'Location is required']
      },
      staffSignature:{
        type: String,
        required: [true, 'Staff Signature is required']
      },
      servicesCode:{
        type: String,
        required: [true, 'Services Code is required']
      }
    }
  ],
  comments : [{
    commentDate: {type: Date},
    staffInitials: {type: String},
    commentText: {type: String},
  }]
});

supportedEmploymentSchema.pre(/^find/, function(next){
  this.populate({ path: 'consumer', select: 'firstName lastName' });
  next();
});

// supportedEmploymentSchema.pre('validate', function(next) {
//   if (this.records > 10) throw("todoList exceeds maximum array size (10)!");
//   next();
// });

module.exports = mongoose.model('SupportedEmployment', supportedEmploymentSchema);