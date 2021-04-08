const mongoose = require('mongoose');

// NOTE: I could do like this 
// const positionSchema = mongoose.Schema({
//     name: String,
//     slug: String
// })
// psitions: [positionSchema]

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A departament must have a name'],
    },
    slug: {
        type: String,
    },
    numberEmployees: {
        type: Number,
        default: 0
    },
    employees: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    positions: [String],
    createDate: Date,
});

const Model = mongoose.model('Department', departmentSchema);

module.exports = Model;