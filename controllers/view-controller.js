const async = require('async');
const multer = require('multer');
const {promisify} = require('util');
const generatePassword  = require('password-generator');
const User = require('../models/user/user');
const Staff = require('../models/user/staff');
const ConsumerForm = require('../models/form/consumer-form');
const Employment = require('../models/employment');
const EnvChecklistData = require('../models/data/environmental-checklist-data');
const AppError  = require('../utils/app-error');
const fileUpload = require('../utils/file_upload');

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


const getUsers = async (req, res, next) =>{
  try {
    const users = await User.find({})
    return users;
  } 
  catch (err) {
    return next(new AppError(err, 404));
  }
}

const getConsumerForms = async (req, res, next) =>{
  try {
    const forms = await ConsumerForm.find({});
    return forms;

  } catch (err) {
    return next(new AppError(err, 404));
  }
}

//Handler functions

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
  const users = await getUsers();
  const consumerForms = await getConsumerForms();
  res.status(200).render('dashboard/dashboard', {
    title: 'Dashboard',
    totalUsers: users.length,
    totalConsumerForms: consumerForms.length
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


//-- Consumer Forms Pages Handlers --//
exports.getAllConsumerForms = async(req, res, next) =>{
  try {
    const forms = await getConsumerForms();
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
