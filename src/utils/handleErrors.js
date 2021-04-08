const AppError = require('./appError');

exports.handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(404, message);
}