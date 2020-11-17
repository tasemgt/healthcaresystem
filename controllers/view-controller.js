const async = require('async');
const multer = require('multer');
const {promisify} = require('util');
const generatePassword  = require('password-generator');
const User = require('../models/user/user');
const Staff = require('../models/user/staff');
const Consumer = require('../models/consumer');
const ConsumerForm = require('../models/form/consumer-form');
const Employment = require('../models/employment');
const Appointment = require('../models/appointment');

const RespiteServiceForm = require('../models/delivery-log/respite-service-form');
const SupportedHomeLivingForm = require('../models/delivery-log/supported-home-living-form');
const SupportedEmploymentForm = require('../models/delivery-log/supported-employment-form');
const RssSLServiceForm = require('../models/delivery-log/rss-sl-service-form');
const DayHabilitationForm = require('../models/delivery-log/day-habilitation-service-form');

const EnvChecklistData = require('../models/data/environmental-checklist-data');
const respiteActivities = require('../models/data/respite-activities');
const rssActivities = require('../models/data/rss-activities');
const habilitationAreas = require('../models/data/habilitation-areas');


const AppError  = require('../utils/app-error');
const fileUpload = require('../utils/file_upload');
const sms = require('../utils/sms');



const multerStorage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, `public/files`);
  },
  filename: (req, file, cb) =>{
    req.tempFileID = `${generatePassword(12, false)}-${Date.now()}`;
    cb(null, `${req.tempFileID}-${file.originalname}`);
  }
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) =>{
  if(file.mimetype.startsWith('application/pdf')){
    cb(null, true);
  }
  else{
    cb(new AppError('Not a pdf document! Please upload only pdfs', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadDocuments = upload.fields([
  {name: 'id_card', maxCount: 1},
  {name: 'ss_card', maxCount: 1},
  {name: 'highSchool_cert', maxCount: 1}
]);

exports.setTempID = (req, res, next)=>{
  req.body.id_card = req.files.id_card[0].filename;
  req.body.ss_card = req.files.ss_card[0].filename;
  req.body.highSchool_cert = req.files.highSchool_cert[0].filename;
  console.log(req.body);
  next();
}

const getDocuments = async Model =>{
  try {
    const documents = await Model.find({})
    return documents;
  } 
  catch (err) {
    return new AppError(err, 404);
  }
}

const getOneDocument = async Model =>{
  try {
    const document = await Model.find({})
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



//-- Employment/Applications Handlers --//
exports.employmentFormPage = (req, res) =>{
  res.status(200).render('employment', {
    title: 'Employment Form'
  });
}

exports.submitEmployment = async(req, res) =>{
  try {
    req.body.references = JSON.parse(req.body.references); //Parse to js object after converting from formData
    const employment = await Employment.create(req.body);
    const phone = employment.phone.substring(1);

    //Send sms
    await sms.sendSMS(`+234${phone}`, process.env.TWILIO_PHONE, 
    `Hello ${employment.firstName}, \nThanks for your application. Your application ID is '${employment.applicationId}'. Give this ID to your Program Director for your enrollment into the system. \nRegards.`)

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
    directors: function(callback){
      User.find({role:'director'}, callback);
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


//-- Consumers and Consumer Forms Pages Handlers --//

// Consumers Create Form
exports.registerConsumerPage = (req, res) =>{
  res.status(200).render('dashboard/consumers/add-consumer', {
    title: 'Register a Consumer'
  });
}

exports.getAllConsumers = async(req, res, next) =>{
  try {
    const consumers = await getDocuments(Consumer);
    
    res.status(200).render('dashboard/consumers/all-consumers', {
      title: 'All Consumers',
      consumers
    });

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

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
    const datas = await EnvChecklistData.find();
    console.log(datas);
    res.status(200).render('dashboard/consumers/form-views/environmental-checklist-form', {
      title: 'Environmental Safety Checklist Form',
      datas
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
exports.respiteServiceDeliveryPage =  async (req, res) =>{
  const title = 'Respite Service Delivery Log'
  if(req.query.all){
    const logs = await getDocuments(RespiteServiceForm);
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
exports.supportedHomeLivingPage =  async (req, res) =>{
  const title = 'Supported Home Living / CS / CFC-PAS / Habilitation Log'
  if(req.query.all){
    const forms = await getDocuments(SupportedHomeLivingForm);
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-home-living/supported-home-living-form', {
      title
    });
  }
  //Fetch data to porpulate view
}

// Supported Home Employment
exports.supportedEmploymentPage =  async (req, res) =>{
  const title = 'Supported Employment / Employment Assistance Delivery Log'
  if(req.query.all){
    const forms = await getDocuments(SupportedEmploymentForm);
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-table', {
      title,
      forms
    });
  }
  if(req.query.new){
    return res.status(200).render('dashboard/consumers/delivery-logs-form-views/supported-employment/supported-employment-form', {
      title
    });
  }
  //Fetch data to porpulate view
}

// RSS - SL Service Delivery Log Form
exports.rssSLServicePage =  async (req, res) =>{
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
exports.dayHabilitationServicePage =  async (req, res) =>{
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