const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        maxlength: [50, 'First name should be maximun 50 chars'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide first name'],
        maxlength: [50, 'Last name should be maximun 50 chars'],
        trim: true
    },
    businessEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Please provide business email'],
        unique: true,
    },
    businessPhone: {
        type: String,
        required: [true, 'Please provide business phone number'],
    },
    jobTitle: {
        type: String,
        required: [true, 'Please provide your job title']
    },
    companyName: {
        type: String,
        required: [true, 'Please provide company name'],
    },
    companyId: {
        type: String,
        unique: [true, 'The company ID should be unique'],
        // required: [true, 'Please provide company name'],
    },
    numberOfEmployees: {
        type: Number,
        required: [true, 'Please provide the number of employees'],
        min: [1, 'The number of employees should be minimum 1']
    },
    country: {
        type: String,
        required: [true, 'Please provide the country'],
    },
    city: {
        type: String,
        required: [true, 'Please provide the city'],
    },
    createdAt: Date
});

companySchema.pre('save', function(next) {
    // set the createdAt propery
    this.createdAt = new Date();
    next();
})

const Model = mongoose.model('Company', companySchema);

module.exports = Model;