const User = require('./../modules/userModule');


exports.createNewUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        if(!newUser) return next(err);

        res.status(200).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
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