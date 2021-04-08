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