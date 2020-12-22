const AppError = require('../utils/app-error');


exports.createOne = (Model) => async (req, res) =>{
  try{
    console.log((req.body));
    const document = await Model.create(req.body);
    res
    .status(201)
    .json({
      status: 'success',
      data: document
    });
  }
  catch(err){
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateOne = Model => async (req, res, next) =>{
  try{
    const document = await Model.findByIdAndUpdate(req.params.id || req.query.id, req.body, {
      new: true, //To return the updated document
    });

    if(!document){
      return next(new AppError('No resource found with that ID', 404));
    }

    res
    .status(200)
    .json({
      status: 'success',
      data: document
    });
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  } 
};
