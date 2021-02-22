const crypto = require('crypto');

const mongoose = require('mongoose');

const functions = require('./../utils/functions');

const userSchema = new mongoose.Schema({
    company: {
        type: mongoose.ObjectId,
        ref: 'Companies'
    },
    employeeID: {
        type: String,
        required: [true, 'Please provide employee ID'],
    },
    position: {
        type: String
    },
    salaryGross: {
        type: Number
    },
    salaryNet: {
        type: Number
    },
    joiningDate: {
        type: Date
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
    dateOfBirth: {
        type: Date,
    },
    userRole: {
        type: String,
        enum: ['employee', 'admin', 'hr-manager', 'recruiter']
    },
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
    fatherName: {
        type: String,
        // required: [true, 'Please provide your father\'s name'],
        maxlength: [50, 'Father\'s name should be maximun 50 chars'],
        trim: true
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
    mobile: {
        type: String,
        trim: true,
        // required: [true, 'Please provide mobile phone'],
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
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
            type: String
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
    // isNew: {
    //     type: Boolean,
    //     default: true,
    // },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    emailAndPasswordToken: {
        type: String,
    }
});


userSchema.pre('save', function(next) {
    if(this.isNew){
        
    }
})

// review this 
userSchema.methods.createTokenForEmailValidateAndPasswordCreate = () => {
    const randomStr = functions.createRandomChars(32);

    const hash = crypto.createHash('sha256').update(randomStr).digest('hex');
    // this.emailAndPasswordToken = hash;
    console.log(this);
}

// const Model = mongoose.model('User', userSchema);

module.exports = userSchema;