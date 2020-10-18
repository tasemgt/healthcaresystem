const DentalExam = require('../models/form/dental');
const HotWaterFireForm = require('../models/form/hot-water-fire-form');
const FireEmergencyForm = require('../models/form/fire-emergency-form');
const EnvChecklistForm = require('../models/form/environmental-checklist-form');
const AppError  = require('../utils/app-error');


exports.createDentalExam = async (req, res) =>{
  try {
    
    const dentalExam = await DentalExam.create({
      form_name: 'Dental Examination Form',
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      lc_num: req.body.lcNum,
      examiner: req.body.examiner,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      signatory: `${req.user.firstName} ${req.user.lastName}`
    });

    res.status(201).json({
      status: 'success',
      // data: dentalExam
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}


// Handles Hot Water Assessment and Fire Evacuation Forms
exports.createHotWaterFireForm = async (req, res) =>{
  try {
    const payload = await HotWaterFireForm.create({
      form_name: req.body.formName,
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      address: req.body.address,
      lc_num: req.body.lcNum,
      res_type: req.body.resType,
      strengths: req.body.strengths,
      needs: req.body.needs,
      recommendations: req.body.recommendations,
      questions: req.body.questions,
      signatory: `${req.user.firstName} ${req.user.lastName}`
    });

    res.status(201).json({
      status: 'success',
      data: payload
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

// Fire Emergency Drill Form
exports.createFireEmergencyForm = async (req, res) =>{
  try {
    const payload = await FireEmergencyForm.create({
      form_name: 'Fire / Emergency Drill Form',
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      lc_num: req.body.lcNum,
      address: req.body.address,
      res_type: req.body.resType,
      begin_time: req.body.beginTime,
      end_time: req.body.endTime,
      follow_up: req.body.followUp,
      fire_location: req.body.fireLocation,
      persons_evacuated: req.body.personsEvacuated,
      signatory: `${req.user.firstName} ${req.user.lastName}`
    });

    res.status(201).json({
      status: 'success',
      data: payload
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

// Environmental Checklist Form
exports.createEnvironmentalForm = async (req, res) =>{
  try {
    const payload = await EnvChecklistForm.create({
      form_name: 'Environmental Checklist Form',
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      lc_num: req.body.lcNum,
      agency: req.body.agency,
      inspector: req.body.inspector,
      title: req.body.title,
      site: req.body.site,
      questions: req.body.questions,
      signatory: `${req.user.firstName} ${req.user.lastName}`
    });

    res.status(201).json({
      status: 'success',
      data: payload
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}