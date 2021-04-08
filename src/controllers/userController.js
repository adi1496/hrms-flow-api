const mongoose = require('mongoose');

const User = require('../modules/userModule');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Company = require('./../modules/companyModule');
const {calculateGrossSalary} = require('./../utils/functions');


exports.createNewUser = catchAsync(async (req, res, next) => {
    console.log(req.user);
    if(!req.body) next(new AppError(400, 'There is no body in the request'));

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
    if(!newUser) return next(new AppError(500, 'The employee was not created'));

    const emailVerificationToken =  newUser.createEmailVerificationToken();
    if(!emailVerificationToken) return next(new AppError(500, 'Failed to create email verification token'));
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
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    if(!users) return next(new AppError(404, 'No users found!'));

    if(!users) return next(err);

    res.status(200).json({
        status: 'success',
        data: {
            users: users
        }
    })
});


exports.getOneUser = async (req, res, next) => {
        console.log(req.params);
        const users = await User.findById(req.params.id);
        if(!users) return next(new AppError(404, 'There is no user with this Id'));

        res.status(200).json({
            status: 'success',
            data: {
                users: users
            }
        })
}
