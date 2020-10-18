const AppError = require('../utils/app-error');

const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404);
};



const sendErrorDev = (err, req, res) =>{
  
  //API
  if(req.originalUrl.startsWith('/api')){
    res
    .status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message
    });
  }
  
  //RENDER
  else{
    let statusCode = err.statusCode.toString();
    if(statusCode.startsWith('4') && err.statusCode !== 404){
      switch(statusCode){
        case '401':
          return res.status(401).redirect('/login');
        case '403':
          return res.status(403).json({message: "You are not authorized"});
        default:
          return res.status(500).json({message:"An Error occured..."});
      }
    }


    //EMPLOYMENT (SEPERATE RESOURCE)
    if(req.originalUrl.startsWith('/employment') && err.statusCode === 404){
      res
      .status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message
      });
    }

    //FINALLY RENDER 404 PAGE
    res.status(err.statusCode).json({
      message: err
    })

    // res.status(err.statusCode).render('error', {
    //   title: 'Error!',
    //   msg: err.message
    // });
  }
  
}

const sendErrorProd = (err, req, res) =>{
  // Operational, trusted error: send message to client
  if(err.isOperational){
    res
    .status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  else{
    // 1. Log error
    console.error('ERROR 🎇', err);

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
  
}



module.exports = (err, req, res, next) =>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err);

  if(process.env.NODE_ENV === 'development'){
    console.log('In development.....')
    sendErrorDev(err, req, res);
  } 
  else if(process.env.NODE_ENV === 'production'){

    let error = {...err};
    
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, req, res);
  }
  
};