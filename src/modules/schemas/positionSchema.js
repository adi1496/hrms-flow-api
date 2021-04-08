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

positionSchema.pre('save', function() {
    if(!this.isModified('positionName')) return next();
    this.slug = functions.createSlug(this.positionName);
});

module.exports = positionSchema;