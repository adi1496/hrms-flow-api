const mongoose = require('mongoose');

const salarySchema = mongoose.Schema({
    salary: {
        type: Number,
        required: [true, 'A salary must have a value']
    },
    fromDate: Date,
    toDate: Date
});

module.exports = salarySchema;