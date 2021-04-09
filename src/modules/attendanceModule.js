const mongoose = require('mongoose');

const checkInOutSchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, 'An attendace must be either in or out'],
        enum: ['in', 'out']
    },
    day: {
        type: Number,
        required: [true, 'An attendance must belong to a day']
    },
    hour: {
        type: Number,
        required: [true, 'An attendance must have an hour']
    },
    minutes: {
        type: Number,
        required: [true, 'An attendance must have minutes']
    },
    manuallySet: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String
    }
})

const attendanceSchema = mongoose.Schema({
    employeeId: {
        required: [true, 'An attendace must belong to an employee'],
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    code: {
        type: String,
        required: [true, 'An attendance must belong to a month']
    },
    monthNumber: {
        type: Number
    },
    monthName: {
        type: String,
    },
    year:{
        type: Number
    },
    attendances: [checkInOutSchema]
});

const Model = mongoose.model('Attendance', attendanceSchema);

module.exports = Model;