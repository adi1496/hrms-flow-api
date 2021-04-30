const express = require('express');

const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup-company').post(authController.signupCompany, authController.signUpAdmin);
router.route('/login').post(authController.login);

router.route('/is-logged').get(authController.isLoggedIn);

module.exports = router;