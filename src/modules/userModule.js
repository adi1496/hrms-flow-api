const crypto = require('crypto');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const functions = require('./../utils/functions');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: [8, 'Password should be at least 8 characters long'],
        select: false
    },
    confirmPassword: {
        type: String,
        select: false
    },
    companyCollection: {
        type: String,
        required: [true, 'Collection Name is required']
    },
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
    },
    emailVerificationToken: {
        type: String,
    },
    passwordChangedAt: Date
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

const Model = mongoose.model('User', userSchema);

module.exports = Model;