const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Company = require('./../modules/companyModule');
const User = require('../modules/userModule');
const sendMail = require('../utils/email');
const {isPasswordEqualConfirmPassword, isPasswordMinLength,
createCompanyId, hasUserRights} = require('./../utils/functions');
const { create } = require('./../modules/companyModule');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// create the JWT
const createJWT = async (id) => {
    const options = {
        expiresIn: Date.now() + (process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    }
    const token = await jwt.sign({id: id}, process.env.JWT_SECRET, options);
    return token;
}

const verifyJWT = async(token) => {
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    return data;
}

// sign up the company
exports.signupCompany = catchAsync(async(req, res, next) => {
    if(!req.body) return next(new AppError(400, 'There is no data in the body'));

    if(!isPasswordEqualConfirmPassword(req.body.password, req.body.confirmPassword)) 
        return next(new AppError(400, 'Passwords are not the same'));
    if(!isPasswordMinLength(req.body.password)) 
        return next(new AppError(400, 'Password should be at least 8 chars long'));

    const companyData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        businessEmail: req.body.businessEmail,
        businessPhone: req.body.businessPhone,
        jobTitle: req.body.jobTitle,
        companyName: req.body.companyName,
        companyLogo: req.body.companyLogo,
        numberOfEmployees: req.body.numberOfEmployees,
        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address: req.body.address
    }

    const newCompany = await Company.create(companyData);
    if(!newCompany) return next('Company not registered!');

    req.company = newCompany;
    req.company.password = req.body.password;
    req.company.confirmPassword = req.body.confirmPassword;
    next();
});

// sign up the admin
exports.signUpAdmin = catchAsync(async (req, res, next) => {
    const userData = {
        firstName: req.company.firstName,
        lastName: req.company.lastName,
        email: req.company.businessEmail,
        password: req.company.password,
        confirmPassword: req.company.confirmPassword,
        userRole: 'admin',
        departament: 'administration',
        position: 'administrator'
    }

    const newUser = await User.create(userData);
    if(!newUser) return next(new AppError(500, `Couldn't create the user`));

    // review the email verification section
    const emailVerificationToken =  newUser.createEmailVerificationToken();
    if(!emailVerificationToken) return next(new AppError(500, 'Email verification token was not created'));

    // // console.log(passwordEmailToken);
    // const subject = 'Welcome to HRMS Flow';
    // const message = `Hey! Thanks for joining us. Please go to this address in order to complete the authentication: ${emailVerificationToken}\n\nSee ya, \nHRMS Team`;
    // await sendMail(newUser.email, subject, message);

    // console.log(req.company, newUser);
    res.status(200).json({
        status: 'success',
        data: {
            message: 'Company registered!'
        }
    })
});

// LOG IN FUNCTION
exports.login = async(req, res, next) => {
    try {
        if(!req.body.email || !req.body.password) return next(new AppError(400, 'Please provide email and password!'));
        console.log(req.body);

        const user = await User.findOne({email: req.body.email}).select('+password');
        if(!user) return next(new AppError(401, `The user or password is wrong`));

        const isPasswordCorrect = await user.checkCandidatePassword(req.body.password);
        if(isPasswordCorrect === false) return next(new AppError(401`The user or password is wrong`));

        const token = await createJWT(user._id);
        if(!token) return next(new AppError(500, 'Could not create the token'));

        res.status(200).json({
            status: 'success',
            data: {
                token: token
            }
        })
    } catch (error) {
        next(error);
    }
}

// check if user is logged in
exports.protect = catchAsync(async(req, res, next) => {
    if(!req.headers.authorization) return next(new AppError(401, 'You are not logged in'));
    
    let token;
    if(req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    
    
    if(!token) return next(new AppError(401, 'There is no valid token, please login again'));
    
    const dataToken = await verifyJWT(token);
    if(!dataToken) return next(new AppError(401, 'The token is incorrect, please log in again'));

    // get user from users collection
    const user = await User.findById(dataToken.id);
    if(!user) return next(new AppError(400, 'The token was malformed, please log in again'));

    // check if the token expired
    if(dataToken.exp < Date.now()) return next(new AppError(401, 'Your sesion has expired, please log in again'));

    // check if the password was changed before JWT was issued
    const changedPasswordAfterJWT = user.checkPasswordModifiedAfterJWT(dataToken.iat);
    if(changedPasswordAfterJWT === true) return next(new AppError(401, 'The password was recently changed, please log in again'));

    req.user = user;
    next();
});

// restric access to users
exports.restrictTo = (acceptedRoles) => {
    return (req, res, next) => {
        if(!hasUserRights(req.user.userRole, acceptedRoles)) 
                        return next(new AppError(401, 'You do not have rights to access this'));

        next();
    }
}