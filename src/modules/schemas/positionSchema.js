const mongoose = require('mongoose');

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
    startDate: Date,
    stopDate: Date
});

module.exports = positionSchema;