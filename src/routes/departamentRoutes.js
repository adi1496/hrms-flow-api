const express = require('express');

const departmentController = require('./../controllers/departmentController');

const router = express.Router();

router.route('/').post(departmentController.addDepartment);

module.exports = router;