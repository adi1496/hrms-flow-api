const mongoose = require('mongoose');

const globalUsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: [true, 'This user already exists']
    },
    companyId: {
        type: String,
        required: [true, 'A user must belong to a company']
    }
});

module.exports = globalUsersSchema;