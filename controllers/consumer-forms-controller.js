const DentalExam = require('../models/form/dental');
const HotWaterFireForm = require('../models/form/hot-water-fire-form');
const FireEmergencyForm = require('../models/form/fire-emergency-form');
const EnvChecklistForm = require('../models/form/environmental-checklist-form');
const poisonAssmentForm = require('../models/form/poison-assessment-form');
const legalAssessmentForm = require('../models/form/legal-assessment-form');

const RespiteServiceForm = require('../models/delivery-log/respite-service-form');
const supportedHomeForm = require('../models/delivery-log/supported-home-living-form');
const supportedHomeRecordForm = require('../models/delivery-log/supported-home-living-record');
const SupportedEmploymentForm = require('../models/delivery-log/supported-employment-form');

const Consumer = require('../models/consumer');
const factory = require('./handler-factory');
const AppError  = require('../utils/app-error');


/// ------------ Body Middlewares ----------------------//
exports.getConsumerFromLcNum = async(req, res, next) =>{
  try {
    const consumer = await Consumer.findOne({lcNumber:req.body.lcNumber});
    if(!consumer){
      return next(new AppError('No Consumer found with provided Local Case Number', 404));
    }
    req.body.consumer = consumer._id;
    req.body.signatory = req.user._id;
    req.body.staff = req.user._id;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.createSupportedHomeRecord = async(req, res, next) =>{
  try{
    const records = [...req.body.records];
    const recordIDs = [];
    records.forEach((item) =>{
      item.staffSignature = `${req.user.firstName} ${req.user.lastName}`;
    });
    const newRecords = await supportedHomeRecordForm.insertMany(records);
    newRecords.forEach((record) =>{
      recordIDs.push(record._id);
    });
    req.body.records = recordIDs;
    next();
  }catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.addStaffToRecords = async(req, res, next) =>{
  try {
    const records = [...req.body.records];
    records.forEach((record) =>{
      record.staffSignature = `${req.user.firstName} ${req.user.lastName}`;
    });
    req.body.records = records;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}


//  End of Middlewares section ..................//

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
      official_name: req.body.official,
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

// Poison Assessment Form
exports.createPoisonAssessmentForm = async (req, res) =>{
  try {
    const payload = await poisonAssmentForm.create({
      form_name: 'Toxic Poison Assessment Form',
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      lc_num: req.body.lcNum,
      address: req.body.address,
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

// Legal Assessment Form
exports.createLegalAssessmentForm = async (req, res) =>{
  try {
    const payload = await legalAssessmentForm.create({
      form_name: 'Legal Status Assessment Form',
      consumer_name: req.body.consumer,
      dateOfAppointment: req.body.date,
      dob: req.body.dob,
      lc_num: req.body.lcNum,
      minorAdult: req.body.minorAdult,
      evaluator: req.body.evaluator,
      currentStatus: req.body.currentStatus,
      recommendation: req.body.recommendation,
      action: req.body.action,
      guardianshipType: req.body.guardianshipType,
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


// ---------------------------------------------------------------- //

// Respite Service Delivery Form
exports.createRespiteServiceDeliveryForm = factory.createOne(RespiteServiceForm);

exports.createSupportedHomeForm = factory.createOne(supportedHomeForm);

exports.createSupportedEmploymentForm = factory.createOne(SupportedEmploymentForm);