const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Company = require('./../modules/companyModule');
const employeeSchema = require('../modules/employeeModule');
const User = require('./../modules/userModule');
const sendMail = require('../utils/email');
const {isPasswordEqualConfirmPassword, isPasswordMinLength,
createCompanyId, hasUserRights} = require('./../utils/functions');
const { create } = require('./../modules/companyModule');

// create the JWT
const createJWT = async (id, companyCollection) => {
    const options = {
        expiresIn: Date.now() + (process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    }
    const token = await jwt.sign({id: id, companyCollection: companyCollection}, process.env.JWT_SECRET, options);
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

        const companyCollection = createCompanyId(req.body.companyName);

        const companyData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            businessEmail: req.body.businessEmail,
            businessPhone: req.body.businessPhone,
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            companyCollection: companyCollection,
            numberOfEmployees: req.body.numberOfEmployees,
            country: req.body.country,
            city: req.body.city,
            postalCode: req.body.postalCode,
            address: req.body.address
        }

        const newCompany = await Company.create(companyData);
        if(!newCompany) return next('Company not registered!');

        const userData = {
            email: req.body.businessEmail,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            companyCollection: companyCollection,
            companyId: newCompany._id
        }

        const newUser = await User.create(userData);
        if(!newUser) return next(`Couldn't create the user`);

        // review the email verification section
        const emailVerificationToken =  newUser.createEmailVerificationToken();
        if(!emailVerificationToken) return next('Email verification token was not created');

        // // console.log(passwordEmailToken);
        // const subject = 'Welcome to HRMS Flow';
        // const message = `Hey! Thanks for joining us. Please go to this address in order to complete the authentication: ${emailVerificationToken}\n\nSee ya, \nHRMS Team`;
        // await sendMail(newUser.email, subject, message);

        console.log(newCompany, newUser);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Company registered!'
            }
        })

    } catch (error) {
        next(error);
    }
}

// LOG IN FUNCTION
exports.login = async(req, res, next) => {
    try {
        if(!req.body.email || !req.body.password) return next('Please provide email and password!');
        console.log(req.body);

        const user = await User.findOne({email: req.body.email}).select('+password');
        if(!user) return next(`The user or password is wrong`);

        const isPasswordCorrect = await user.checkCandidatePassword(req.body.password);
        if(isPasswordCorrect === false) return next(`The user or password is wrong`);

        const token = await createJWT(user._id, user.companyCollection);
        if(!token) return next('Could not create the token');

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
exports.isLoggedIn = async(req, res, next) => {
    try {
        if(!req.headers.authorization) return next('You are not logged in');
    
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