const mongoose = require('mongoose');

const userSchema = require('./../modules/userModule');

exports.createNewUser = async (req, res, next) => {
    

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