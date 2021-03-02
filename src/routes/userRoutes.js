const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
.get(userController.getAllUsers)
.post(authController.isLoggedIn, userController.createNewUser)
.patch();

router.route('/signup-company').post(authController.signupCompany, authController.signUpUserThatRegisterCompany);

// authController.signUpUserThatRegisterCompany

module.exports = router;