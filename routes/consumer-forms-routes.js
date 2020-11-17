const express = require('express');
const consumerFormsController = require('../controllers/consumer-forms-controller');
const auth = require('../middlewares/auth-middlewares');

const DayHabilitationForm = require('../models/delivery-log/day-habilitation-service-form');

const router = express.Router();

router.post('/dental-exam', auth.authenticate, consumerFormsController.createDentalExam);
router.post('/hot-water-fire-form', auth.authenticate, consumerFormsController.createHotWaterFireForm);
router.post('/fire-emergency-form', auth.authenticate, consumerFormsController.createFireEmergencyForm);
router.post('/environmental-checklist-form', auth.authenticate, consumerFormsController.createEnvironmentalForm);
router.post('/poison-assessment-form', auth.authenticate, consumerFormsController.createPoisonAssessmentForm);
router.post('/legal-assessment-form', auth.authenticate, consumerFormsController.createLegalAssessmentForm);

// ....................................//
router.post('/respite-service-forms', auth.authenticate, consumerFormsController.getConsumerFromLcNum, consumerFormsController.createRespiteServiceDeliveryForm);
router.post(
  '/supported-home-forms', 
  auth.authenticate, 
  consumerFormsController.getConsumerFromLcNum, 
  consumerFormsController.createSupportedHomeRecord,
  consumerFormsController.createSupportedHomeForm);

router.post(
  '/supported-employment-forms', 
  auth.authenticate, 
  consumerFormsController.getConsumerFromLcNum,
  consumerFormsController.addStaffToRecords,
  consumerFormsController.createSupportedEmploymentForm);

router.post(
  '/rss-sl-service-forms',
  auth.authenticate,
  consumerFormsController.getConsumerFromLcNum,
  consumerFormsController.createRSSSLServiceWeek,
  consumerFormsController.createRSSSLServiceForm
);

router.post(
  '/day-habilitation-forms',
  auth.authenticate,
  consumerFormsController.getConsumerFromLcNum,
  consumerFormsController.uniqueForms(DayHabilitationForm),
  consumerFormsController.createDayHabilitationForm
)

module.exports = router;