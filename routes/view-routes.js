const express = require('express');
const viewController = require('../controllers/view-controller');
const auth = require('../middlewares/auth-middlewares');


const router = express.Router();

const employmentDocs = [
  {name: 'id_card', maxCount: 1},
  {name: 'ss_card', maxCount: 1},
  {name: 'highSchool_cert', maxCount: 1}
]

router.get('/', viewController.root);
router.get('/login', viewController.loginPage);

router.get('/agency', viewController.agencyFormPage);
router.post('/agency', viewController.submitAgencyReg);
router.get('/agency/:agencyId', auth.authenticate, auth.authorize('admin'), viewController.getAgencyByAgencyId);
router.patch('/agency/:id', auth.authenticate, auth.authorize('admin'), viewController.approveAgency);

router.get('/employment', viewController.employmentFormPage);
//router.post('/employment', viewController.uploadDocs(employmentDocs), viewController.setTempID, viewController.submitEmployment);
router.get('/employment/:applicationId', auth.authenticate, auth.authorize('director'), viewController.getEmployment);
router.patch('/employment/:id', auth.authenticate, auth.authorize('director'), viewController.updateEmployment);


// router.use();
router.get('/dashboard', auth.authenticate, viewController.dashboardPage);
router.get('/dashboard/users', auth.authenticate, auth.authorize('admin'), viewController.allUsersPage);
router.get('/dashboard/users/add', auth.authenticate, auth.authorize('director'), viewController.addUserPage);
router.get('/dashboard/users/add-program-director', auth.authenticate, auth.authorize('admin'), viewController.addDirectorPage);
router.get('/dashboard/appointments', auth.authenticate, viewController.getAllAppointmentsPage);
router.get('/dashboard/appointments/add', auth.authenticate, viewController.appointmentFormPage);
router.get('/dashboard/profile', auth.authenticate, viewController.profilePage);

router.get('/dashboard/agency-applications', auth.authenticate, auth.authorize('admin'), viewController.getAllAgencyApplicationsPage);
router.get('/dashboard/agency-applications/:id', auth.authenticate, auth.authorize('admin'), viewController.getAgencyApplicationDetailsPage);

router.get('/dashboard/applications', auth.authenticate, auth.authorize('director'), viewController.getAllApplicationsPage);
router.get('/dashboard/applications/:id', auth.authenticate, auth.authorize('director'), viewController.getApplicationDetailsPage);


//Consumers section
router.get('/dashboard/consumers', auth.authenticate, viewController.getAllConsumers);
router.get('/dashboard/consumers/add', auth.authenticate, auth.authorize('director'), viewController.registerConsumerPage);
router.get('/dashboard/consumers/download', auth.authenticate, auth.authorize('director'), viewController.downloadConsumerDocument);
router.get('/dashboard/consumers/:id', auth.authenticate, auth.authorize('admin','director'), viewController.getConsumerDetailsPage);


router.get('/dashboard/consumer-forms', auth.authenticate, viewController.getAllConsumerForms);
router.get('/dashboard/consumers/dental-form', auth.authenticate, viewController.dentalFormPage);
router.get('/dashboard/consumers/hot-water-form', auth.authenticate, viewController.hotWaterFormPage);
router.get('/dashboard/consumers/fire-evac-form', auth.authenticate, viewController.fireEvacFormPage);
router.get('/dashboard/consumers/fire-emergency-form', auth.authenticate, viewController.fireEmergencyFormPage);
router.get('/dashboard/consumers/environmental-checklist-form', auth.authenticate, viewController.environmentalChecklistFormPage);
router.get('/dashboard/consumers/poison-assessment-form', auth.authenticate, viewController.poisonAssessmentFormPage);
router.get('/dashboard/consumers/legal-assessment-form', auth.authenticate, viewController.legalAssessmentFormPage);
//---------------------------------------------------------------------------------------------------------//
router.get('/dashboard/consumers/respite-service-delivery', auth.authenticate, viewController.respiteServiceDeliveryPage);
router.get('/dashboard/consumers/supported-home-living', auth.authenticate, viewController.supportedHomeLivingPage);
router.get('/dashboard/consumers/supported-employment', auth.authenticate, viewController.supportedEmploymentPage);
router.get('/dashboard/consumers/rss-sl-service', auth.authenticate, viewController.rssSLServicePage);
router.get('/dashboard/consumers/day-habilitation-service', auth.authenticate, viewController.dayHabilitationServicePage);

// Nurses section
router.get('/dashboard/nurses/nursing-service-delivery', auth.authenticate, auth.authorize('admin', 'director'), viewController.nursingServicesDeliveryPage);
router.get('/dashboard/nurses/nursing-service-checklist', auth.authenticate, auth.authorize('admin', 'director'), viewController.nursingServicesChecklistPage);
router.get('/dashboard/nurses/nursing-tasks-screening', auth.authenticate, auth.authorize('admin', 'director'), viewController.nursingTasksScreeningPage);
router.get('/dashboard/nurses/exclusion-of-hhcc', auth.authenticate, auth.authorize('admin', 'director', 'nurse'), viewController.nursingExclusionOfHostHomePage);
router.get('/dashboard/nurses/rn-delegation-checklist', auth.authenticate, auth.authorize('admin', 'director'), viewController.rnDelegationChecklistPage);
router.get('/dashboard/nurses/comprehensive-nursing-assessment', auth.authenticate, auth.authorize('admin', 'director'), viewController.comprehensiveNursingAssessmentPage);




module.exports = router;