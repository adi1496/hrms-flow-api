const AppError = require('./appError');

const PASSWORD_MIN_LENGTH = 8;

// create random hex characters 
exports.createRandomChars = (size) => {
    const bytesList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let randomChars = [];

    for (let i = 0; i < size; i++) {
        randomChars.push(bytesList[Math.floor(Math.random() * (bytesList.length - 1))]);
    }

    return randomChars.join('');
};

// check if password === confirmPassword
exports.isPasswordEqualConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
}

// check password length
exports.isPasswordMinLength = (password) => {
    return password.length >= PASSWORD_MIN_LENGTH;
}

// create the company ID
exports.createCompanyId = (name) => {
    name = name.toLowerCase();
    const nameSplit = name.split(' ');
    return `${nameSplit.join('-')}${Date.now()}`;
}

// check if user role exists in the array of accepted roles
exports.hasUserRights = (userRole, acceptedRoles) => {
    return acceptedRoles.includes(userRole);
}

// calculate gross salary when we have the net salary
// !!!!!!! Revision this function !!!! This is not done yet
exports.calculateGrossSalary = (salary) => {
    const netSalary = parseInt(salary);
    return netSalary + netSalary * 0.5;
}







// CREATE SLUG
exports.createSlug = (text) => {
    text = text.toLowerCase();
    const textSplit = text.split(' ');
    return textSplit.join('-');
}









// create Position for employee
exports.setPositionSalaryPeriod = (fromDate, timeMonths) => {
    timeMonths = parseInt(timeMonths);
    if(!fromDate) {
        fromDate = new Date();
    }else {
        fromDate = new Date(fromDate);
    }

    let toDate;
    if(timeMonths === 0) {
        toDate = new Date('1970-01-01');
    }else {
        toDate = new Date(new Date().setMonth(fromDate.getMonth() + timeMonths));
    }

    return {toDate, fromDate};
}






// get attendace details
exports.getAttendanceMonth = (date, next) => {
    const monthNamesArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const newDate = new Date(date);

    if(newDate instanceof Date && isNaN(newDate)) return {error: "This is not a valid date!"}
    // console.log(newDate instanceof Date, isNaN(newDate));

    const code = `${newDate.getMonth()}-${newDate.getFullYear()}`;
    const monthNumber = newDate.getMonth() + 1;
    const monthName = monthNamesArray[newDate.getMonth()];
    const year = newDate.getFullYear();
    const day = newDate.getDate();
    let hour = newDate.getUTCHours();
    let minutes = newDate.getMinutes();

    if(minutes < 25 ) minutes = 0;
    if(minutes >= 25 && minutes < 55 ) minutes = 30;
    if(minutes >= 55) {
        hour ++;
        minutes = 0;
    }

    if(hour > 23) hour = 0;
    // console.log(typeof minutes);
    // console.log(month, day, monthName, hours, minutes);

    return {code, monthNumber, monthName, year, day, hour, minutes};
}