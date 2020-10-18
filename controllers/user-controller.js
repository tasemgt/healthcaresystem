const generatePassword  = require('password-generator');

const User = require('../models/user/user');
const Staff = require('../models/user/staff');
const AppError = require('../utils/app-error');


exports.createUser = async(req, res) =>{
  const password = generatePassword(12, false);
  console.log("User password: ", password);
  const { firstName, lastName, email, phone, address, ssn, bio, role, employment} = req.body;

  if(role === 'director'){
    return
  }

  try {
    const user = await Staff.create({
      firstName, lastName, email, phone, role, address, bio, ssn, password, employment
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
        password
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};



exports.getUsers = async(req, res) =>{
  try {
    const users = await User.find();

    res
    .status(200)
    .json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } 
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}

exports.getMe = (req, res, next) =>{
  if(!req.user) return next(new AppError('You must be logged in to get your details', 401));
  req.params.id = req.user.id // Gotten from my token
  next();
};

exports.getUser = async (req, res, next) =>{
  try{
    const {id} = req.params;
    const user = await User.findById(id);

    if(!user){
      return next(new AppError('No user found with that ID', 404));
    }

    res
    .status(200)
    .json({
      status: 'success',
      data: { user }
    });
  }
  catch(err){
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};