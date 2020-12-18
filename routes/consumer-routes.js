const express = require('express');
const authenticator = require('../middlewares/auth-middlewares');
const consumerController = require('../controllers/consumer-controller');
const fileUpload = require('../utils/file_upload');

const router = express.Router();

const docs = [
  {name: 'directedPlan', maxCount: 1},
  {name: 'ipc', maxCount: 1},
  {name: 'transferPaper', maxCount: 1},
  {name: 'icap', maxCount: 1},
  {name: 'idrc', maxCount: 1},
  {name: 'consumerRights', maxCount: 1}
]

router.post('/', 
  authenticator.authenticate, 
  authenticator.authorize('director'),
  fileUpload.multerPdf(docs),
  consumerController.setDocumentIDs,
  consumerController.awsS3Upload,
  consumerController.registerConsumer);


module.exports = router;