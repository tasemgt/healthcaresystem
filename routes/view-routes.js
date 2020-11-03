const express = require('express');
const viewController = require('../controllers/view-controller');
const auth = require('../middlewares/auth-middlewares');


const router = express.Router();

router.get('/', viewController.root);
router.get('/login', viewController.loginPage);
router.get('/employment', viewController.employmentFormPage);
router.post('/employment', viewController.uploadDocuments, viewController.setTempID, viewController.submitEmployment);
router.get('/employment/:applicationId', auth.authenticate, auth.authorize('director'), viewController.getEmployment);
router.patch('/employment/:id', auth.authenticate, auth.authorize('director'), viewController.updateEmployment);


// router.use();
router.get('/dashboard', auth.authenticate, viewController.dashboardPage);
router.get('/dashboard/users', auth.authenticate, auth.authorize('director'), viewController.allUsersPage);
router.get('/dashboard/users/add', auth.authenticate, auth.authorize('director'), viewController.addUserPage);
router.get('/dashboard/profile', auth.authenticate, viewController.profilePage);


//Get consumer forms
router.get('/dashboard/consumer-forms', auth.authenticate, viewController.getAllConsumerForms);
router.get('/dashboard/consumers/dental-form', auth.authenticate, viewController.dentalFormPage);
router.get('/dashboard/consumers/hot-water-form', auth.authenticate, viewController.hotWaterFormPage);
router.get('/dashboard/consumers/fire-evac-form', auth.authenticate, viewController.fireEvacFormPage);
router.get('/dashboard/consumers/fire-emergency-form', auth.authenticate, viewController.fireEmergencyFormPage);
router.get('/dashboard/consumers/environmental-checklist-form', auth.authenticate, viewController.environmentalChecklistFormPage);


router.get('/dashboard/applications', auth.authenticate, auth.authorize('director'), viewController.getAllApplicationsPage);
router.get('/dashboard/applications/:id', auth.authenticate, auth.authorize('director'), viewController.getApplicationDetailsPage);

module.exports = router;