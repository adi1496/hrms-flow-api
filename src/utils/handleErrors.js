const AppError = require('./appError');

exports.handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(404, message);
}

exports.handleJWTMalformedErr = (err) => {
    const message = 'The token was malformed, please log in again';
    return new AppError(401, message);
}