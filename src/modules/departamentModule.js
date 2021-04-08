const mongoose = require('mongoose');

const functions = require('./../utils/functions');

// NOTE: I could do like this 
const positionSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A position must have a name']
    },
    slug: String
});

positionSchema.pre('save', function(){
    if(!this.isModified('name')) return next();
    this.slug = functions.createSlug(this.name);
});
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
    positions: [positionSchema],
    createDate: Date,
});

// Create the slug when a new department is created
departmentSchema.pre('save', function(){
    if(!this.isNew) return next();
    console.log('Departament is not is not new');
    this.slug = functions.createSlug(this.name);
    this.createDate = Date.now();
});

// update slug if name was edited !!!
departmentSchema.pre('save', function(){
    if(!this.isModified('name')) return next();
    this.slug = functions.createSlug(this.name);
})

const Model = mongoose.model('Department', departmentSchema);

module.exports = Model;