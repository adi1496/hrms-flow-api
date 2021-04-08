const express = require('express');

const departmentController = require('./../controllers/departmentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
.get(departmentController.getAllDepartments)
.post(authController.restrictTo('admin'), departmentController.createNewDepartment);

router.route('/:id')
.get(departmentController.getDepartmentById)
.patch(authController.restrictTo('admin'), departmentController.updateDepartment)
.delete(authController.restrictTo('admin'), departmentController.deleteDepartment);

module.exports = router;