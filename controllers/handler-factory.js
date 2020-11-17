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
