const express = require('express');

const departmentController = require('./../controllers/departmentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
.get(departmentController.getAllDepartments)
.post(authController.protect, authController.restrictTo('admin'), departmentController.createNewDepartment);

router.route('/:id')
.get(departmentController.getDepartmentById)

module.exports = router;