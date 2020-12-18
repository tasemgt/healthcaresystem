const multer = require('multer');
const AWS = require('aws-sdk');
const cloudinary = require('cloudinary');
const AppError  = require('./app-error');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.cloudinary = {
    upload: (buffer, options, cb) =>{
      cloudinary.v2.uploader.upload_stream(cb, options).end(buffer);
  }
}

exports.multerPdf = (docs) =>{
  
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
    storage,
    fileFilter: multerFilter
  });
  
  
  //File uploads middleware
  return upload.fields(docs);
  
}

exports.aws = () =>{
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  });
  return s3;
}