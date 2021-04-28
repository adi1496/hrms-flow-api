
// const Department = require('./../modules/departamentModule');
const departmentSchema = require('./../modules/departamentModule');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// create a new department
exports.createNewDepartment = catchAsync(async (req, res, next) => {
    const Department = req.db.model('Department', departmentSchema);

    const newDepartment = await Department.create(req.body);
    if(!newDepartment) return next(new AppError(400, 'The department was not created'));

    console.log(newDepartment);

    res.status(200).json({
        status: 'success',
        data: {
            newDepartment
        }
    });
});



// Get all departments
exports.getAllDepartments = catchAsync(async(req, res, next) => {
    const Department = req.db.model('Department', departmentSchema);

    const departments = await Department.find();
    if(!departments) return next(new AppError(404, 'No departments found'));

    res.status(200).json({
        status: 'success',
        data: {
            departments
        }
    });
});


// Get department by Id
exports.getDepartmentById = catchAsync(async (req, res, next) => {
    const Department = req.db.model('Department', departmentSchema);

    // console.log(req.params);
    const department = await Department.findById(req.params.id);
    if(!department) return next(new AppError(404, 'No department with this id'));

    console.log(department);

    res.status(200).json({
        status: 'success',
        data: {
            department
        }
    })

});




// Update a departament using id
exports.updateDepartment = catchAsync(async(req, res, next) => {
    const Department = req.db.model('Department', departmentSchema);

    if(!req.params.id) return next(new AppError(400, 'There are no department in your request'));

    const department = await  Department.findById(req.params.id);

    res.status(404).json({
        status: 'fail',
        message: 'not implemented yet'
    })
});




// Delete a department
exports.deleteDepartment = catchAsync(async(req, res, next) => {
    const Department = req.db.model('Department', departmentSchema);

    if(!req.params.id) return next(new AppError(400, 'There are no department in your request'));

    const department = await Department.findById(req.params.id);
    if(!department) return next(new AppError(404, 'No department with this id'));

    await Department.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        message: 'The department has been deleted'
    })
});