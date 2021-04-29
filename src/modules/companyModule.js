const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: [true, 'A user must belong to a company']
    },
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
    companyName: {
        type: String,
        required: [true, 'Please provide company name'],
    },
    companyLogo: {
        type: String
    },
    numberEmployees: {
        type: String,
        required: [true, 'Please provide the number of employees'],
        enum: ['0-20', '20-100', '100-500', '500+']
    },
    country: {
        type: String,
        required: [true, 'Please provide the country'],
    },
    city: {
        type: String,
        required: [true, 'Please provide the city'],
    },
    postalCode: {
        type: String,
    },
    address: {
        type: String,
        // required: [true, 'Please provide address'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: Date
},{collection: 'company'});

companySchema.pre('save', function(next) {
    // set the createdAt propery
    this.createdAt = new Date();
    next();
})

// const Model = mongoose.model('Company', companySchema);
// module.exports = Model;

module.exports = companySchema;