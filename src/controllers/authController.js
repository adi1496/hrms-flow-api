const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Company = require('./../modules/companyModule');
const userSchema = require('./../modules/userModule');
const sendMail = require('../utils/email');

// create the JWT
const createJWT = async (id, companyId) => {
    const options = {
        expiresIn: Date.now() + (process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    }
    const token = await jwt.sign({id: id, companyId: companyId}, process.env.JWT_SECRET, options);
    return token;
}

const verifyJWT = async(token) => {
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    return data;
}

exports.signupCompany = async(req, res, next) => {
    try {
        if(!req.body) return next();

        if(req.body.password !== req.body.confirmPassword) return res.status(401).json({message: 'Passwords are not the same'});
        if(req.body.password.length < 8) return res.status(401).json({message: 'Password should be at least 8 chars long'});

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            businessEmail: req.body.businessEmail,
            businessPhone: req.body.businessPhone,
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            numberOfEmployees: req.body.numberOfEmployees,
            country: req.body.country,
            city: req.body.city
        }

        // create and set the companyID
        let name = data.companyName.toLowerCase();
        name = name.split(' ');
        console.log(name);
        data.companyId = `${name.join('-')}${Date.now()}`;

        const newCompany = await Company.create(data);

        if(!newCompany) {
            console.log('Company not registered!');
            return next();
        }

        req.company = newCompany;
        next();

    } catch (error) {
        console.error(error);
    }
}


exports.signUpUserThatRegisterCompany = async (req, res, next) => {
    if(!req.company) return next();

    try {
        const companyId = req.company.companyId;
        
        const data = {
            employeeID: Date.now(), // temporary
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.businessEmail,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            mobile: req.body.businessPhone,
            company: req.company.companyId,
            position: req.body.jobTitle,
            userRole: 'admin'
        }
        
        const User = mongoose.model(companyId, userSchema);
        const newUser = await User.create(data);

        if(!newUser) return next();

        // review this
        const emailVerificationToken =  newUser.createEmailVerificationToken();

        if(!emailVerificationToken) return next();

        // // console.log(passwordEmailToken);
        // const subject = 'Welcome to HRMS Flow';
        // const message = `Hey! Thanks for joining us. Please go to this address in order to complete the authentication: ${emailVerificationToken}\n\nSee ya, \nHRMS Team`;
        // await sendMail(newUser.email, subject, message);

        const token = await createJWT(newUser._id, newUser.company);

        res.status(200).json({
            status: 'success',
            data: {
                user: newUser,
                company: req.company,
                token
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.isLoggedIn = async(req, res, next) => {
    if(!req.headers.authorization) return next();

    let token;
    if(req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next();

    const data = await verifyJWT(token);
    if(!data) return next();

    console.log(data);
    
    const User = mongoose.model(data.companyId, userSchema);

    const user = await User.findById(data.id)
    console.log(user);

    if(!user) return next();

}