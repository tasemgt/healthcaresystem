const NursingServiceDeliveryForm = require('../models/nurse-form/nursing-service-delivery-form');

const factory = require('./handler-factory');
const AppError  = require('../utils/app-error');


// Middlewares---------------


exports.createNursingServiceDeliveryForm = factory.createOne(NursingServiceDeliveryForm);