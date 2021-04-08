const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
.get(userController.getAllUsers)
.post(authController.protect,
    authController.restrictTo(['admin', 'hr-manager']),
    userController.createNewUser)
.patch();

router.route('/:id')
.get(authController.protect ,authController.restrictTo('admin', 'hr-manager'), userController.getOneUser);

router.route('/signup-company').post(authController.signupCompany, authController.signUpAdmin);
router.route('/login').post(authController.login);

// authController.signUpUserThatRegisterCompany

module.exports = router;