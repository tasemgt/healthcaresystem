const Appointment = require('../models/appointment');
const User = require('../models/user/user');
const sendEmail = require('../utils/email');
const sms = require('../utils/sms');


exports.bookAppointment = async(req, res) =>{
  try {
    const appointment = await Appointment.create(req.body);
    const director = await User.findOne({role:'director'});

    const phone = director.phone.substring(1);

    //Send email
    sendEmail({
      email: director.email,
      subject: 'New Appointment Request',
      message: `Hello ${director.firstName}, \n\nYou have a new appointment request from ${appointment.consumerName} \n\nBest.`
    });

    //Send sms
    // await sms.sendSMS(`+234${phone}`, '------', //process.env.TWILIO_PHONE,
    // `Hello ${director.firstName}, \nYou have a new appointment request from ${appointment.consumerName} \nRegards.`)

    res.status(201).json({
      status: 'success',
      data: {
        appointment
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}