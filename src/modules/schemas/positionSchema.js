const mongoose = require('mongoose');

const functions = require('./../../utils/functions');

const positionSchema = mongoose.Schema({
    positionName: {
        type: String,
        required: [true, 'A position must have a name']
    },
    slug: {String},
    departament: {
        type: mongoose.Schema.ObjectId,
        ref: 'Deparament'
    },
    fromDate: Date,
    toDate: Date
});

positionSchema.pre('save', function(next) {
    if(!this.isModified('positionName')) return next();
    this.slug = functions.createSlug(this.positionName);

    next();
});

module.exports = positionSchema;