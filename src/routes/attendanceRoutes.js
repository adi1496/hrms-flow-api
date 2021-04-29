const express = require('express');

const attendanceController = require('./../controllers/attendanceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').post(attendanceController.createNewAttendance);

router.route('/:id')
.get(authController.restrictTo('admin'), attendanceController.getEmployeeAllAttendances)

router.route('/employee-attendance-per-month/:code/:id')
.get(authController.restrictTo('admin'), attendanceController.getEmployeeMonthAttendances);
// !!!!!!!!!!!!!!!!   finish this after front-end     !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// .patch(authController.restrictTo('admin'), attendanceController.updateAttendance)
// .patch(authController.restrictTo('admin'), attendanceController.deleteAttendance)

module.exports = router;