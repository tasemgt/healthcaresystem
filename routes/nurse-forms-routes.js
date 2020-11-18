const express = require('express');
const nurseFormsController = require('../controllers/nurse-forms-controller');
const auth = require('../middlewares/auth-middlewares');

const router = express.Router();


router.post(
  '/nurse-services-delivery-forms', 
  auth.authenticate,
  auth.authorize('director'),
  nurseFormsController.createNursingServiceDeliveryForm);




module.exports = router;