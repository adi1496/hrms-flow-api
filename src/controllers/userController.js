const mongoose = require('mongoose');

const userSchema = require('../modules/userModule');
const departmentSchema = require('../modules/userModule');
// const User = require('../modules/userModule');
// const Department = require('./../modules/departamentModule');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const functions = require('./../utils/functions');


// create new Employee
exports.createNewUser = catchAsync(async (req, res, next) => {
    // console.log(req.user);
    const User = req.db.model('User', userSchema);
    const Department = req.db.model('Department', departmentSchema);

    if(!req.body) next(new AppError(400, 'There is no body in the request'));

    if(!req.body.department) return next(new AppError(400, 'Please select the department'));
    if(!req.body.position) return next(new AppError(400, 'Please select the position for new user'));

    const department = await Department.findOne({slug: req.body.department});
    if(!department) return next(new AppError(400, 'This department does not exists'));

    let positionExists = false;
    department.positions.forEach(position => {
        if(position.slug === req.body.position.positionName) {
            positionExists = true;
            req.body.position.positionName = position.name
        }
    });

    if(positionExists === false) return next(new AppError(400, 'This position does not exists in the database'));

    const userData = req.body;
    userData.hireDate = Date.now();
    userData.isActive = false; // avoid the pre save middleware about 'password'
    userData.userRole = 'employee';

    const periodDates = functions.setPositionSalaryPeriod(userData.position.fromDate, userData.position.timeMonths);
    
    userData.positions = [];
    userData.salaries = [];
    userData.positions.push({
        positionName: userData.position.positionName,
        fromDate: periodDates.fromDate,
        toDate: periodDates.toDate
    });

    userData.salaries.push({
        salary: userData.salary,
        fromDate: periodDates.fromDate,
        toDate: periodDates.toDate
    });

    delete userData.position;
    delete userData.salary;
    delete userData.department;

    const newUser = await User.create(userData);
    if(!newUser) return next(new AppError(500, 'The employee was not created'));

    department.employees.push(newUser._id);
    department.numberEmployees ++;
    await department.save({validateBeforeSave: false});

    const emailVerificationToken =  newUser.createEmailVerificationToken();
    if(!emailVerificationToken) return next(new AppError(500, 'Failed to create email verification token'));
    // send email 
    //.. 
    
    //send response
    res.status(200).json({
        status: 'success',
        data: {
            newUser: newUser,
            emailVerificationToken
        }
    });
});






exports.getAllUsers = catchAsync(async (req, res, next) => {
    const User = req.db.model('User', userSchema);

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


exports.getOneUser = catchAsync(async (req, res, next) => {
    // console.log(req.params);
    const User = req.db.model('User', userSchema);

    const users = await User.findById(req.params.id);
    if(!users) return next(new AppError(404, 'There is no user with this Id'));

    res.status(200).json({
        status: 'success',
        data: {
            users: users
        }
    })
});
