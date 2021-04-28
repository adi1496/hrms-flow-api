const crypto = require('crypto');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const positionSchema = require('./schemas/positionSchema');
const salarySchema = require('./schemas/salarySchema');
const functions = require('../utils/functions');

const userSchema = new mongoose.Schema({
    // companyId: {
    //     type: mongoose.ObjectId,
    //     ref: 'Companies'
    // },
    // employeeID: {
    //     type: String,
    //     required: [true, 'Please provide employee ID'],
    // },
    // department: {
    //     type: String
    // },
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
    fatherName: {
        type: String,
        // required: [true, 'Please provide your father\'s name'],
        maxlength: [50, 'Father\'s name should be maximun 50 chars'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    userRole: {
        type: String,
        enum: ['employee', 'admin', 'hr-manager', 'recruiter']
    },

    //password related
    password: {
        type: String,
        minlength: [8, 'Password should be at least 8 characters long'],
        select: false
    },
    confirmPassword: {
        type: String,
        select: false
    },
    passwordChangedAt: Date,

    positions: [positionSchema],
    salaries: [salarySchema],
    hireDate: Date,

    dateOfBirth: Date,
    gender: {
        // required: [true, 'Please provide gender'],
        type: String,
        enum: ['male', 'female']
    },
    maritalStatus: {
        type: String,
        enum: ['single', 'married', 'separated', 'divorced']
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    nationality: {
        type: String,
        // required: [true, 'Please provide nationality'],
    },
    country: {
        type: String,
        // required: [true, 'Please provide country'],
    },
    city: {
        type: String,
        // required: [true, 'Please provide city'],
    },
    postalCode: {
        type: String,
    },
    address: {
        type: String,
        // required: [true, 'Please provide address'],
    },
    phone: {
        type: String,
        trim: true
    },

    photo: {
        type: String,
    },
    resume: {
        type: String,
    },
    contractPaper: {
        type: String
    },
    idProof: {
        type: String
    },
    otherDocuments: [
        {
            type: String,
            document: String
        }
    ],
    bankName: {
        type: String
    },
    bankAccountName: {
        type: String
    },
    bankAccountNumber: {
        type: String
    },
    status: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
    }
});

// hash password after creating account or password change
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    // if(this.password !== this.confirmPassword) return next('The passwords are not the same');

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    this.passwordChangedAt = Date.now() - 1000;

    next();
});


userSchema.methods.createEmailVerificationToken = function() {
    const randomStr = functions.createRandomChars(32);

    const hash = crypto.createHash('sha256').update(randomStr).digest('hex');
    this.emailVerificationToken = hash;

    return randomStr;
}

userSchema.methods.checkCandidatePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.checkPasswordModifiedAfterJWT = function(iatJWT) {
    const passwordChangedAt = this.passwordChangedAt.getTime() / 1000;
    return passwordChangedAt >= iatJWT;
}

// const Model = mongoose.model('User', userSchema);

// module.exports = Model;

module.exports = userSchema;