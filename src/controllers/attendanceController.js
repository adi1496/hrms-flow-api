
const Attendance = require('./../modules/attendanceModule');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const functions = require('./../utils/functions');

// CREATE NEW ATTENDANCE (CHECK-IN OR CHECK-OUT)
exports.createNewAttendance = catchAsync(async (req, res, next) => {
    if(!req.body) return next(new AppError(400, 'Your request is empty!'));
    // console.log(req.user, req.body);
    const dateObj = functions.getAttendanceMonth(req.body.date);
    // console.log(dateObj);
    if(dateObj.error) return next(new AppError(400, dateObj.error));

    let employeeAttendances = await Attendance.findOne({employeeId: req.user._id, code: dateObj.code});
    if(!employeeAttendances) {
        employeeAttendances = await Attendance.create({
            employeeId: req.user._id,
            code: dateObj.code,
            monthNumber: dateObj.monthNumber,
            monthName: dateObj.monthName,
            year: dateObj.year
        });
    }

    const newAttendance = {
        type: req.body.type,
        day: dateObj.day,
        hour: dateObj.hour,
        minutes: dateObj.minutes
    }

    if(req.body.notes) newAttendance.notes = req.body.notes;
    if(req.body.manuallySet) newAttendance.manuallySet = req.body.manuallySet;

    employeeAttendances.attendances.push(newAttendance);
    await employeeAttendances.save({validateBeforeSave: true});

    // console.log(employeeAttendances);

    res.status(200).json({
        status: 'success',
        data: {
            newAttendance
        }
    });
});



// GET ONE EMPLOYEE ATTENDANCES FOR 1 MONTH
exports.getEmployeeMonthAttendances = catchAsync(async(req, res, next) => {
    if(!req.params.code || !req.params.id) return next(new AppError(400, 'The request is not ok!'));

    const attendanceMonth = await Attendance.findOne({employeeId: req.params.id, code: req.params.code});
    if(!attendanceMonth) return next(new AppError(404, 'There are not attendances for this month'));

    res.status(200).json({
        status: 'success',
        data: {
            attendanceMonth
        }
    })
});



// GET ONE EPLOYEE(BY ID) ALL ATTENDANCES 
exports.getEmployeeAllAttendances = catchAsync(async(req, res, next) => {
    if(!req.params.id) return next(new AppError(400, 'You must secify the id of the employee'));

    const employeeAttendances = await Attendance.find({employeeId: req.params.id});
    if(!employeeAttendances) return next(new AppError(404, 'No attendances foud for this employee'));

    res.status(200).json({
        status: 'success',
        data: {
            employeeAttendances
        }
    });
});




// UPDATE AN ATTENDACE (ONLY ADMIN)

/// finish this after frontend !!!!!!!!!!!!!!!!!!!!!
exports.updateAttendance = catchAsync(async(req, res, next) => {
    if(!req.params.code || !req.params.id) 
        return next(new AppError(400, 'The request is not ok, we need the month-code and the employeeId'));

    if(!req.body) return next(new AppError(400, 'Your body request is empty!'));

    const attendancesEmp = await Attendance.findOne({employeeId: req.params.id, code: req.params.code});
    if(!attendancesEmp) return next(new AppError(404, 'There are not attendances for this month'));

    const time = {
        hour: parseInt(req.body.time.split(':')[0]),
        minutes: parseInt(req.body.time.split(':')[1])
    }

    attendance.attendances.forEach(attendance => {
        if(attendance.day === parseInt(req.body.day) && attendance.type === req.body.type) {
            attendance.hour = time.hour;

        }
    })
})