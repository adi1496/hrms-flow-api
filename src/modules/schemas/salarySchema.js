const mongoose = require('mongoose');

const salarySchema = mongoose.Schema({
    salary: {
        type: Number,
        required: [true, 'A salary must have a value']
    },
    fromDate: Date,
    toDate: Date
});

salarySchema.pre('save', function(){
    if(!this.isNew) return next();
    if(!this.fromDate) this.fromDate = Date.now();
});

module.exports = salarySchema;