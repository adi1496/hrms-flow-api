const express = require('express');

const platformController = require('./../controllers/platformController');

const router = express.Router();

router.route('/').post(platformController.addCountryTaxes);

module.exports = router;