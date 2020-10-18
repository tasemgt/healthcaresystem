const express = require('express');
const consumerFormsController = require('../controllers/consumer-forms-controller');
const auth = require('../middlewares/auth-middlewares');

const router = express.Router();

router.post('/dental-exam', auth.authenticate, consumerFormsController.createDentalExam);
router.post('/hot-water-fire-form', auth.authenticate, consumerFormsController.createHotWaterFireForm);
router.post('/fire-emergency-form', auth.authenticate, consumerFormsController.createFireEmergencyForm);
router.post('/environmental-checklist-form', auth.authenticate, consumerFormsController.createEnvironmentalForm);



module.exports = router;