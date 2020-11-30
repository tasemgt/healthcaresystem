const mongoose = require('mongoose');

const comprehensiveNursingAssessmentSchema = new mongoose.Schema({
  individualName:{
    type: String,
    required: [true, 'Individual name is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required']
  },
  todaysDate: {
    type: Date,
    required: [true, 'Date is required']
  },
  review: {
    title: String,
    healthCareTeam: {
      title: String,
      content: [{
        title: String, practitioner: String, lastSeen: Date, comment: String
      }]
    },
    supports: {
      content: [{
        title: String, relationship: String, telephoneNo: String
      }]
    },
    healthHistory: {
      title: String,
      history: [{
        title: String, diagnosis: String
      }]
    },
    currentMedications:[{
      medication: String, dose: String, freq: String, route: String, purpose: String, sideEffects: String
    }],
    rN: String,
    individual: String,
    date: Date
  },
  currentStatus: {
    title: String,
    currentHistory: [{
      history: String,
      response: String
    }],
    vitalSigns: {
      bloodPressure: String,
      pulse: {
        rate: String, rhythm: String,
      },
      respirations: {
        rate: String, rhythm: String
      },
      temperature: String,
      painLevel: String,
      bloodSugar: String,
      weight: String,
      Height: String,
      comments: String
    },
    labs: String,
    rN: String,
    individual: String,
    date: Date,
    assessment: {
      response: String,
      types: {
        neurological: Boolean,
        musculoskeletal: Boolean,
        unknown: Boolean
      },
      comments: String
    }
  },
  systemsReview: {
    title: String,
    neurological: {
      aims: { title: String, response: String},
      illness: [{
        title: String, response: String
      }],
      seizures: {
        response: String, frequency: String, duration: String
      },
      comments: String
    },
    een: [{
      title: String,
      checks: [{
        name: String,
        checked: Boolean
      }]
    }],
    throat: {
      checks: [{
        name: String,
        checked: Boolean
      }],
      swallowStudy: String,
      results: String,
      comments: String,
      date: Date
    },
    cardiovascular:{ 
      questions: [{
        name: String,
        response: String
      }],
      normalRange: String, comments: String
    },
    respiratory: {
      breathing: String,
      others: [{
        name: String, response: String
      }],
      comments: String
    },
    gastrointestinal: {
      type: [
        {name: String, checked: Boolean}
      ],
      bowel: [{
        name: String, desc: String
      }],
      others: [{
        name: String, response: String
      }],
      comments: String
    },
    musculoskeletal: {
      comments: String,
      others: [{
        name: String, response: String
      }]
    },
    genitourinary: {
      comments: String,
      others: [{
        name: String, response: String
      }]
    },
    integumentary: {
      skinAssessment: String,
      skin: [{
        name: String, checked: Boolean
      }],
      others: String
    },
    endocrine: {
      type: [{
        name: String, 
        response: String, 
        type: String, 
        management: [{ name: String, checked: Boolean}], 
        other: { name: String, response: String}
      }], 
      comments: String
    },
    rn: String,
    individual: String,
    date: Date
  },
  statusInfo: {
    
  }
});


module.exports = mongoose.model('ComprehensiveNursingAssessment', comprehensiveNursingAssessmentSchema);