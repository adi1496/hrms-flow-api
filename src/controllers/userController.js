const mongoose = require('mongoose');

const userSchema = require('./../modules/userModule');
const {calculateGrossSalary} = require('./../utils/functions');

exports.createNewUser = async (req, res, next) => {
    try {
        // console.log(req.user);
        if(!req.body) next('There is no body in the request');
    
        const userData = req.body;
        userData.employeeID = Date.now();
        userData.companyId = req.user.companyId;
        userData.companyCollectionName = req.user.companyCollectionName;
        userData.joiningDate = Date.now();
        if(userData.salaryNet) userData.salaryGross = calculateGrossSalary(userData.salaryNet);
        userData.isActive = false; // avoid the pre save middleware about 'password'  
        userData.userRole = 'employee';

        const User = mongoose.model(userData.companyCollectionName, userSchema);

        const newUser = await User.create(userData);
        if(!newUser) return next('The user was not created');

        const emailVerificationToken =  newUser.createEmailVerificationToken();
        if(!emailVerificationToken) return next('Failed to create email verification token');
        // send email 
        //.. 


        //send response
        res.status(200).json({
            status: 'success',
            data: {
                newUser: newUser,
                emailVerificationToken
            }
        })

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