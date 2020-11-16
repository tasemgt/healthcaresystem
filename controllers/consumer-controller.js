const Consumer = require('../models/consumer');
const AppError = require('../utils/app-error');


exports.registerConsumer = async(req, res, next) =>{
  try {
    const consumer = await Consumer.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        consumer
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
}