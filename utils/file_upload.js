const multer = require('multer');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    upload: (buffer, options, cb) =>{
      cloudinary.v2.uploader.upload_stream(cb, options).end(buffer);
  }
}