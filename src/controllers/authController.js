const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Company = require('./../modules/companyModule');
const userSchema = require('./../modules/userModule');
const sendMail = require('../utils/email');
const {isPasswordEqualConfirmPassword, isPasswordMinLength,
createCompanyId, hasUserRights} = require('./../utils/functions');
const { create } = require('./../modules/companyModule');

// create the JWT
const createJWT = async (id, companyCollectionName) => {
    const options = {
        expiresIn: Date.now() + (process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    }
    const token = await jwt.sign({id: id, companyCollectionName: companyCollectionName}, process.env.JWT_SECRET, options);
    return token;
}

const verifyJWT = async(token) => {
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    return data;
}


// sign up the company
exports.signupCompany = async(req, res, next) => {
    try {
        if(!req.body) return next('There is no data in the body');

        if(!isPasswordEqualConfirmPassword(req.body.password, req.body.confirmPassword)) return next('Passwords are not the same');
        if(!isPasswordMinLength(req.body.password)) return next('Password should be at least 8 chars long');

        const companyData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            businessEmail: req.body.businessEmail,
            businessPhone: req.body.businessPhone,
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            companyId: createCompanyId(req.body.companyName),
            numberOfEmployees: req.body.numberOfEmployees,
            country: req.body.country,
            city: req.body.city
        }

        const newCompany = await Company.create(companyData);

        if(!newCompany) return next('Company not registered!');

        req.company = newCompany;
        next();

    } catch (error) {
        next(error);
    }
}

// sign up the user that registered the company
exports.signUpUserThatRegisterCompany = async (req, res, next) => {
    try {
        if(!req.company) return next('There is no company in the request header');

        const companyId = req.company.companyId;
        
        const userData = {
            employeeID: Date.now(), // temporary
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.businessEmail,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            mobile: req.body.businessPhone,
            companyId: req.company._id,
            companyCollectionName: companyId,
            position: req.body.jobTitle,
            userRole: 'admin'
        }
        
        const User = mongoose.model(companyId, userSchema);
        const newUser = await User.create(userData);

        if(!newUser) return next('The user was not created');

        // review this
        const emailVerificationToken =  newUser.createEmailVerificationToken();

        if(!emailVerificationToken) return next('Email verification token was not created');

        // // console.log(passwordEmailToken);
        // const subject = 'Welcome to HRMS Flow';
        // const message = `Hey! Thanks for joining us. Please go to this address in order to complete the authentication: ${emailVerificationToken}\n\nSee ya, \nHRMS Team`;
        // await sendMail(newUser.email, subject, message);

        const token = await createJWT(newUser._id, newUser.companyCollectionName);
        if(!token) next('Could not create the token')

        res.status(200).json({
            status: 'success',
            data: {
                user: newUser,
                company: req.company,
                token
            }
        })
    } catch (error) {
        next(error);
    }
}


// check if user is logged in
exports.isLoggedIn = async(req, res, next) => {
    try {
        if(!req.headers.authorization) return next('There is no token available, please try again');
    
        let token;
        if(req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
    
        if(!token) return next('There is no token');
    
        const dataToken = await verifyJWT(token);
        if(!dataToken) return next('The token is incorrect');
    
        // console.log(dataToken);
        
        const User = mongoose.model(dataToken.companyCollectionName, userSchema);
    
        const user = await User.findById(dataToken.id)
        // console.log(user);
    
        if(!user) return next('User was not found');
    
        req.user = user;
        next();
        
    } catch (error) {
        next(error);
    }
}

// restric access to users
exports.restrictTo = (acceptedRoles) => {
    return (req, res, next) => {
        if(!hasUserRights(req.user.userRole, acceptedRoles)) return next('User does not have rights');

        next();
    }
}