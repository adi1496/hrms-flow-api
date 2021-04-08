
const Department = require('./../modules/departamentModule');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// create a new department
exports.createNewDepartment = catchAsync(async (req, res, next) => {
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