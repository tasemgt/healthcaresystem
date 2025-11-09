const async = require('async');
const multer = require('multer');
const {promisify} = require('util');
const generatePassword  = require('password-generator');
const User = require('../models/user/user');
const Staff = require('../models/user/staff');
const Director = require('../models/user/director');
const Consumer = require('../models/consumer');
const ConsumerForm = require('../models/form/consumer-form');
const Employment = require('../models/employment');
const Agency = require('../models/agency');
const Appointment = require('../models/appointment');

const RespiteServiceForm = require('../models/delivery-log/respite-service-form');
const SupportedHomeLivingForm = require('../models/delivery-log/supported-home-living-form');
const SupportedEmploymentForm = require('../models/delivery-log/supported-employment-form');
const RssSLServiceForm = require('../models/delivery-log/rss-sl-service-form');
const DayHabilitationForm = require('../models/delivery-log/day-habilitation-service-form');

// Static Data for use in pages
const EnvChecklistData = require('../models/data/environmental-checklist-data');
const respiteActivities = require('../models/data/respite-activities');
const rssActivities = require('../models/data/rss-activities');
const habilitationAreas = require('../models/data/habilitation-areas');
const nursingServiceDescriptions = require('../models/data/nursing-service-description');
const nursingServiceChecklistData = require('../models/data/nursing-service-checklist-data');
const nursingTasksScreeningData = require('../models/data/nursing-tasks-screening-data');
const rnDelegationChecklistData = require('../models/data/rn-delegation-checklist-data');
const comprehensiveNursingAssessmentData = require('../models/data/comprehensive-nursing-assessment-data');
const addConsumerServices = require('../models/data/add-consumer-services-data');

// Nurse Models
const NursingServiceDeliveryForm = require('../models/nurse-form/nursing-service-delivery-form');
const NursingServiceChecklistForm = require('../models/nurse-form/nursing-service-checklist-form');
const NursingTasksScreeningForm = require('../models/nurse-form/nursing-tasks-screening-form');
const ExclusionHostForm = require('../models/nurse-form/exclusion-form');
const RNDelegationChecklistForm = require('../models/nurse-form/rn-delegation-checklist-form');
const ComprehensiveNursingAssessmentForm = require('../models/nurse-form/comprehensive-nursing-assessment-form');


const AppError  = require('../utils/app-error');
const fileUpload = require('../utils/file_upload');
const sms = require('../utils/sms');
const sendEmail = require('../utils/email');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) =>{
//     cb(null, `public/files`);
//   },
//   filename: (req, file, cb) =>{
//     req.tempFileID = `${generatePassword(12, false)}-${Date.now()}`;
//     cb(null, `${req.tempFileID}-${file.originalname}`);
//   }
// });

// const multerStorage = multer.memoryStorage();

const storage = multer.memoryStorage({
  destination: (req, file, cb) =>{
    cb(null, '');
  }
});

const multerFilter = (req, file, cb) =>{
  if(file.mimetype.startsWith('application/pdf')){
    cb(null, true);
  }
  else{
    cb(new AppError('Not a pdf document! Please upload only pdfs', 400), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

//File uploads middleware
exports.uploadDocs = (docs) =>{
  return upload.fields(docs);
}


// exports.uploadDocuments = upload.fields();

exports.setTempID = (req, res, next)=>{
  //Sets a temporal identifier for files uploaded to server
  req.body.id_card = req.files.id_card[0].filename;
  req.body.ss_card = req.files.ss_card[0].filename;
  req.body.highSchool_cert = req.files.highSchool_cert[0].filename;
  console.log(req.body);
  next();
}

const getDocuments = async (Model, query) =>{
  try {
    const documents = query? await Model.find(query) : await Model.find({});
    return documents;
  } 
  catch (err) {
    return new AppError(err, 404);
  }
}

const getOneDocument = async (Model, query) =>{
  try {
    const document = query? await Model.find(query) : null;
    return document;
  } 
  catch (err) {
    return new AppError(err, 404);
  }
}


////////  Handler functions ////////////

//-- Auth Pages Handlers --//
exports.loginPage = (req, res) =>{
  res.status(200).render('login', {
    title: 'Login'
  });
}

exports.root = (req, res) =>{
  res.status(200).redirect('/dashboard');
}


//-- Dashboard Page Handlers --//
exports.dashboardPage = async(req, res) =>{
  const users = await getDocuments(User);
  const consumerForms = await getDocuments(ConsumerForm);
  const appointments = await getDocuments(Appointment);
  res.status(200).render('dashboard/dashboard', {
    title: 'Dashboard',
    totalUsers: users.length,
    totalConsumerForms: consumerForms.length,
    totalAppointments: appointments.length
  });
};


//-- Agency Application Handlers --//
exports.agencyFormPage = (req, res) =>{
  res.status(200).render('agency', {
    title: 'Enroll an Agency'
  });
}

exports.submitAgencyReg = async(req, res) =>{
  try {
    const agency = await Agency.create(req.body);

    console.log('New Agency: ', agency);

    //Send email
    sendEmail({
      email: req.body.email,
      subject: 'Agency Enrollment Received',
      message: `Hello ${agency.name}, \n\nThanks for enrolling into our platform. Here is your enrollment ID: ${agency.agencyId}.\n\nKindly note that this ID is required to complete your registration into the system. \n\nBest Regards,\nFree Lot Care Team`
    });

    //Send sms
    // await sms.sendSMS(`${req.body.phone}`, '--------', // process.env.TWILIO_PHONE, 
    // `Hello ${agency.name}, \nThanks for enrolling into our platform. Your enrollment ID is '${agency.agencyId}'.\nThis ID is required to complete your registeration into the system. \nRegards.`)

    res.status(201).json({
      status: 'success',
      data: {
        agency
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.getAllAgencyApplicationsPage = async(req, res, next) =>{
  try {
    const agencies = await Agency.find();
    res.status(200).render('dashboard/agency-applications/all-agency-applications', {
      title: 'Agency Enrollment Applications',
      agencies
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.getAgencyApplicationDetailsPage = async(req, res, next) =>{
  try {
    const agency = await Agency.findById(req.params.id);
    res.status(200).render('dashboard/agency-applications/agency-application-details', {
      title: `${agency.name}'s Application`,
      agency
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.getAgencyByAgencyId = async(req, res, next) =>{
  try {
    let agency;
    if(req.query.approved !== undefined){
      agency = await Agency.findOne({agencyId: req.params.agencyId, approved: req.query.approved});
    }
    else{
      agency = await Agency.findOne({agencyId: req.params.agencyId});
    }

    if(!agency){
      return next(new AppError('Application with provided ID doesn\'t exist or isn\'t approved yet', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        agency
      }
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.approveAgency = async (req, res, next) =>{
  try{
    const agency = await Agency.findByIdAndUpdate(req.params.id, {approved: req.body.approved}, {
      new: true, //To return the updated document
      // runValidators: true
    });

    if(!agency){
      return next(new AppError('No agency with that ID', 404));
    }

    res
    .status(200)
    .json({
      status: 'success',
      data: agency
    });
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  } 
}

//-- Employment/Applications Handlers --//
exports.employmentFormPage = async(req, res) =>{
  const agencies = await Agency.find({});
  res.status(200).render('employment', {
    title: 'Employment Form',
    agencies
  });
}

exports.submitEmployment = async(req, res) =>{
  try {
    req.body.references = JSON.parse(req.body.references); //Parse to js object after converting from formData
    const employment = await Employment.create(req.body);
    
    //Send sms
    await sms.sendSMS(`${req.body.phone}`, process.env.TWILIO_PHONE, 
    `Hello ${employment.firstName}, \nThanks for your application. Your application ID is '${employment.applicationId}'.\nGive this ID to your Program Director for your enrollment into the system. \nRegards.`)

    res.status(201).json({
      status: 'success',
      data: {
        employment
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.getEmployment = async(req, res, next) =>{
  try {
    let application;
    if(req.query.approved !== undefined){
      application = await Employment.findOne({applicationId: req.params.applicationId, approved: req.query.approved});
    }
    else{
      application = await Employment.findOne({applicationId: req.params.applicationId});
    }

    if(!application){
      return next(new AppError('Application with provided ID doesn\'t exist or isn\'t approved yet', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        application
      }
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.updateEmployment = async (req, res, next) =>{
  try{
    const application = await Employment.findByIdAndUpdate(req.params.id, {approved: req.body.approved}, {
      new: true, //To return the updated document
      // runValidators: true
    });

    if(!application){
      return next(new AppError('No resource found with that ID', 404));
    }

    res
    .status(200)
    .json({
      status: 'success',
      data: { data: application }
    });
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  } 
}


exports.getAllApplicationsPage = async(req, res, next) =>{
  try {
    const applications = await Employment.find();
    res.status(200).render('dashboard/applications/all-applications', {
      title: 'Job Applications',
      applications
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.getApplicationDetailsPage = async(req, res, next) =>{
  try {
    const application = await Employment.findById(req.params.id);
    res.status(200).render('dashboard/applications/application-details', {
      title: `${application.firstName}'s Application`,
      application
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}


//-- Appointments Handlers --//
exports.appointmentFormPage = (req, res) =>{
  res.status(200).render('dashboard/appointments/add-appointment', {
    title: 'Book an Appointment'
  });
}


exports.getAllAppointmentsPage = async(req, res, next) =>{
  const appointments = await getDocuments(Appointment);
  res.status(200).render('dashboard/appointments/all-appointments', {
    title: 'Appointment Bookings',
    appointments
  });
}

//-- Profile Page Handlers --//
exports.profilePage = async (req, res) =>{
  const user = await User.findById(req.user._id);
  res.status(200).render('dashboard/profile', {
    title: 'Profile',
    user: user
  });
};


//-- Users Management page handlers --//
exports.allUsersPage = async(req, res) =>{
  async.parallel({
    // directors: function(callback){
    //   User.find({role:'director'}, callback);
    // },
    directors: function(callback){
      Director.find({}, callback);
    },
    staff: function(callback){
      Staff.find({}, callback);
    }
  }, function(err, results) {
      const users = results.directors.concat(results.staff);
      res.status(200).render('dashboard/users/all-users', {
        title: 'Users Management',
        users
      });
  });
};

exports.addUserPage = (req, res) =>{
  res.status(200).render('dashboard/users/add-user', {
    title: 'Add New User'
  });
};

exports.addDirectorPage = (req, res) =>{
  res.status(200).render('dashboard/agency-applications/add-agency', {
    title: 'Add Program Director'
  });
};



//Settings Area -->
exports.changeUserPassword = (req, res) =>{
  res.status(200).render('dashboard/settings/change-password', {
    title: 'Update User Password'
  });
};

//Error Page Handler -->
exports.getErrorPage = (req, res) =>{
  const { type } = req.query;
  const render = {};
  let code;

  if(type === 'not-found'){
    render.title = `Not Found.`;
    render.message = `Cannot find what you are looking for, sorry!`;
    code = 404;
  }
  else if(type === 'not-authorized'){
    render.title = `Not Authorized.`;
    render.message = `You are not Authorized to view this page, sorry!`;
    code = 403;
  }
  else if(type === 'server-error'){
    render.title = `Server Error`;
    render.message = `Sorry an error occured from our end, we'll fix it up so you can try again later!`;
    code = 500;
  }
  res.status(code).render('dashboard/error', render);
};


//-- Consumers and Consumer Forms Pages Handlers --//

// Consumers Create Form
exports.registerConsumerPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/add-consumer', {
    title: 'Register a Consumer',
    services: addConsumerServices
  });
}

exports.getAllConsumers = async(req, res, next) =>{
  try {
    const docQuery = req.user.role === 'admin'? {}: {agency: req.user.agency._id}; 
    const consumers = await Consumer.find(docQuery);
    
    res.status(200).render('dashboard/consumers/all-consumers', {
      title: 'All Consumers',
      consumers
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.getConsumerDetailsPage = async(req, res, next) =>{
  try {
    const consumer = await Consumer.findById(req.params.id);
    
    res.status(200).render('dashboard/consumers/consumer-details', {
      title: 'Consumer Details',
      consumer
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

exports.downloadConsumerDocument = async(req, res, next) =>{
  
  const s3 = fileUpload.aws();

  try {
    const filename = req.query.file;
    if(filename){
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
      }

      console.log(params);

      const { Body } = await s3.getObject(params).promise();
      res.status(200).end(Body, 'utf8');

    }
    
  } catch (err) {
    return next(new AppError(err, 404));
  }
}


//Gets all Simple Forms
exports.getAllConsumerForms = async(req, res, next) =>{
  try {
    const forms = await getDocuments(ConsumerForm)
    console.log(forms);
    res.status(200).render('dashboard/consumers/completed-forms/all-completed-forms', {
      title: 'All Consumer Forms',
      forms
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}


// Dental Form
exports.dentalFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/dental-exam-form', {
    title: 'Dental Examination Form'
  });
}

// Hot water form
exports.hotWaterFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/hot-water-fire-evac-form', {
    title: 'Hot Water Assessment Form',
    type: 'hot-water'
  });
}

// Fire Evac Form (Re-uses hot water form, with slight differences)
exports.fireEvacFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/hot-water-fire-evac-form', {
    title: 'Fire Evacuation Assessment Form',
    type: 'fire-evac'
  });
}

// Fire Emergency Form
exports.fireEmergencyFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/fire-emergency-form', {
    title: 'Fire / Emergency Drill Form'
  });
}

//Environmental Checklist Form
exports.environmentalChecklistFormPage = async (req, res, next) =>{
  try {
    res.status(200).render('dashboard/consumers/form-views/environmental-checklist-form', {
      title: 'Environmental Safety Checklist Form',
      datas: EnvChecklistData
    });
  } catch (err) {
    return next(new AppError(err, 404));
  }
}

// Toxic Poison Assessment Form
exports.poisonAssessmentFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/poison-assessment-form', {
    title: 'Toxic Poison Assessment Form'
  });
}

// Legal Assessment Form
exports.legalAssessmentFormPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/form-views/legal-assessment-form', {
    title: 'Annual Assessment of Legal Status Form'
  });
}

//--------------------------------------------------------//
// Respite Service Delivery
exports.respiteServiceDeliveryPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Respite Service Delivery Log'
  if(req.query.all){
    const logs = await getDocuments(RespiteServiceForm);
    console.log("LOGS> ",logs);
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/respite-service/respite-service-table', {
      title,
      logs
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/respite-service/respite-service-form', {
      title,
      sections: respiteActivities
    });
  }
  //Fetch data to porpulate view
}

// Supported Home Living Service Delivery
exports.supportedHomeLivingPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Supported Home Living / CS / CFC-PAS / Habilitation Log'
  if(req.query.all){
    const forms = await getDocuments(SupportedHomeLivingForm);
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-table', {
      title,
      forms
    });
  }
  else if(req.query.new){
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-form', {
      title,
      form: null
    });
  }
  else{
    //An Update on form
    const form = await SupportedHomeLivingForm.findById(req.query.id);
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-form', {
      title,
      form
    });
  }
  
}

exports.supportedHomeLivingDetailsPage = async (req, res) =>{
  const form = await SupportedHomeLivingForm.findById(req.params.id).populate({ path: 'records', select: '-__v -_id'});
  if(form){
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-details', {
      title: 'Supported Home Living / CS / CFC-PAS / Habilitation Form',
      form
    });
  }
}

// Supported Home Employment
exports.supportedEmploymentPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Supported Employment / Employment Assistance Delivery Log'
  if(req.query.all){
    const forms = await getDocuments(SupportedEmploymentForm);
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-table', {
      title,
      forms
    });
  }
  else if(req.query.new){
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-form', {
      title,
      form: null
    });
  }
  else{
    //An Update on form
    const form = await SupportedEmploymentForm.findById(req.query.id);
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-form', {
      title,
      form
    });
  }
}

exports.supportedEmploymentDetailsPage = async (req, res) =>{
  const form = await SupportedEmploymentForm.findById(req.params.id);
  console.log(form);
  if(form){
    res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-details', {
      title: 'Supported Employment / Employment Assistance Delivery Log',
      form
    });
  }
}

// RSS - SL Service Delivery Log Form
exports.rssSLServicePage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Residential Support Services (RSS) and Supervised Living (SL) Service Delivery Log'
  const week = 1;
  if(req.query.all){
    const logs = await getDocuments(RssSLServiceForm);
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/rss-sl-service/rss-sl-service-table', {
      title,
      logs
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/rss-sl-service/rss-sl-service-form', {
      title,
      week,
      sections: rssActivities
    });
  }
  //Fetch data to porpulate view
}

// Day Habilitation Service Delivery Log Form
exports.dayHabilitationServicePage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Day Habilitation Service Delivery Log'
  if(req.query.all){
    const logs = await getDocuments(DayHabilitationForm);
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/day-habilitation-service/day-habilitation-service-table', {
      title,
      logs
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/day-habilitation-service/day-habilitation-service-form', {
      title,
      sections: habilitationAreas
    });
  }
  //Fetch data to porpulate view
}


// ------------------------------ NURSING SERVICES FORMS -------------------------------//
// Nursing Services Delivery Log Form
exports.nursingServicesDeliveryPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Nursing Services Delivery Log - Billable Activities'
  if(req.query.all){
    const forms = await getDocuments(NursingServiceDeliveryForm);
    return res.status(200).render('dashboard/nurses/nursing-service-delivery/nursing-service-delivery-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/nursing-service-delivery/nursing-service-delivery-form', {
      title,
      descriptions: nursingServiceDescriptions
    });
  }
  //Fetch data to porpulate view
}

// Nursing Services Checklist Form
exports.nursingServicesChecklistPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Nursing Services Checklist';
  const subtitle = 'Waiver Survey and Certification';
  if(req.query.all){
    const forms = await getDocuments(NursingServiceChecklistForm);
    return res.status(200).render('dashboard/nurses/nursing-service-checklist/nursing-service-checklist-table', {
      title,
      subtitle,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/nursing-service-checklist/nursing-service-checklist-form', {
      title,
      subtitle,
      descriptions: nursingServiceChecklistData
    });
  }
  //Fetch data to porpulate view
}

// Nursing Services Checklist Form
exports.nursingTasksScreeningPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = 'Nursing Tasks Screening Tool Form';
  if(req.query.all){
    const forms = await getDocuments(NursingTasksScreeningForm);
    return res.status(200).render('dashboard/nurses/nursing-tasks-screening/nursing-tasks-screening-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/nursing-tasks-screening/nursing-tasks-screening-form', {
      title,
      data: nursingTasksScreeningData
    });
  }
  //Fetch data to porpulate view
}

// Exclusion of Host Home
exports.nursingExclusionOfHostHomePage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = `Exclusion of Host Home/Companion Care (HH/CC) Provider from the
                  Board of Nursing (BON) Definition of Unlicensed Person`;
  if(req.query.all){
    const forms = await getDocuments(ExclusionHostForm);
    return res.status(200).render('dashboard/nurses/exclusion-host-home/exclusion-host-home-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/exclusion-host-home/exclusion-host-home-form', {
      title
    });
  }
  //Fetch data to populate view
}

// RN Delegation Checklist Form
exports.rnDelegationChecklistPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = `RN Delegation Checklist`;
  const subtitle = `Waiver Survey and Certification | Home and Community-based Services (HCS)/Texas
  Home Living (TxHmL) Program` 
  if(req.query.all){
    const forms = await getDocuments(RNDelegationChecklistForm);
    return res.status(200).render('dashboard/nurses/rn-delegation-checklist/rn-delegation-checklist-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/rn-delegation-checklist/rn-delegation-checklist-form', {
      title,
      subtitle,
      datas: rnDelegationChecklistData
    });
  }
  //Fetch data to populate view
}

// Comprehensive Nursing Assessment Form
exports.comprehensiveNursingAssessmentPage =  async (req, res, next) =>{
  if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
    return next(new AppError('A query parameter is required to load page.', 400));
  }
  const title = `Comprehensive Nursing Assessment Form`;
  const subtitle = `To be performed by a Registered Nurse` 
  if(req.query.all){
    const forms = await getDocuments(ComprehensiveNursingAssessmentForm);
    return res.status(200).render('dashboard/nurses/comprehensive-nursing-assessment/comprehensive-nursing-assessment-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/nurses/comprehensive-nursing-assessment/comprehensive-nursing-assessment-form', {
      title,
      subtitle,
      data: comprehensiveNursingAssessmentData
    });
  }
  //Fetch data to populate view
}