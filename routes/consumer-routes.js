const express = require('express');
const authenticator = require('../middlewares/auth-middlewares');
const consumerController = require('../controllers/consumer-controller');

const router = express.Router();


router.post('/', authenticator.authenticate, consumerController.registerConsumer);


module.exports = router;