const mongoose = require('mongoose');

const User = require('../modules/userModule');
const Company = require('./../modules/companyModule');
const {calculateGrossSalary} = require('./../utils/functions');


exports.createNewUser = async (req, res, next) => {
    try {
        console.log(req.user);
        if(!req.body) next('There is no body in the request');
    
        const userData = req.body;
        // userData.employeeID = Date.now();
        // userData.companyId = req.user.companyId;
        // userData.companyCollectionName = req.user.companyCollection;

        userData.hireDate = Date.now();
        // if(userData.salaryNet) userData.salaryGross = calculateGrossSalary(userData.salaryNet);
        userData.isActive = false; // avoid the pre save middleware about 'password'
        
        // this can be set by the admin
        userData.userRole = 'employee';

        const newUser = await User.create(userData);
        if(!newUser) return next('The employee was not created');

        const emailVerificationToken =  newUser.createEmailVerificationToken();
        if(!emailVerificationToken) return next('Failed to create email verification token');
        // // send email 
        // //.. 
        
        // //send response
        res.status(200).json({
            status: 'success',
            data: {
                newUser: newUser,
                emailVerificationToken
            }
        });

    } catch (error) {
        next(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const User = mongoose.model(req.companyId, userSchema);
        const users = await User.find();

        if(!users) return next(err);

        res.status(200).json({
            status: 'success',
            data: {
                users: users
            }
        })
    } catch (error) {
        
    }
}


exports.getOneUser = async (req, res, next) => {
    try {
        const User = mongoose.model(req.companyId, userSchema);
        console.log(req.params);
        // const users = await User.findById(req.params.id);

        // if(!users) return next(err);

        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         users: users
        //     }
        // })
    } catch (error) {
        
    }
}