const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employmentFormSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String
  },
  phone:{
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  ssn: {
    type: String,
    required: [true, 'Social Security Number is required']
  },
  high_school: {
    type: String,
    required: [true, 'High school is required']
  },
  references: [
    {
      name: { type: String, required: [true, 'A referee must have a name']},
      phone: { type: String, required: [true, 'A referee must have a phone number']}
    }
  ],
  tempFileID: String,
  id_card: String,
  ss_card: String,
  highSchool_cert: String,
  auto_insurance: String,
  approved: {
    type: Boolean,
    default: false
  }
});

employmentFormSchema.plugin(AutoIncrement, {inc_field: 'applicationId'});

module.exports = mongoose.model('EmploymentForm', employmentFormSchema);