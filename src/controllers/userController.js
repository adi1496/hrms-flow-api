const mongoose = require('mongoose');

const userSchema = require('./../modules/userModule');

const createUserThatRegisterCompany = async (req, res, next) => {
    try {
        const companyID = req.company.companyID;

        const data = {
            employeeID: Date.now(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            company: req.company._id,
            email: req.body.businessEmail,
            mobile: req.body.businessPhone,
            position: req.body.jobTitle,
        }

        const User = mongoose.model(companyID, userSchema);
        const newUser = await User.create(data);

        if(!newUser) return next();

        res.status(200).json({
            status: 'success',
            data: {
                user: newUser,
                company: req.company
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.createNewUser = async (req, res, next) => {
    if(req.company){
        await createUserThatRegisterCompany(req, res, next);
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