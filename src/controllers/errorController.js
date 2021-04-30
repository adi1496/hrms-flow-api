const handleErr = require('./../utils/handleErrors');

const sendErrorDevelopment = (err, req, res) => {
    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    });
}

const sendErrorProduction = (err, req, res) => {
    // console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // if node env is development return sendErrorDevelopment function
    if(process.env.NODE_ENV === 'development') return sendErrorDevelopment(err, req, res);

    // if node env is production return sendErrorProduction function
    if(process.env.NODE_ENV === 'production') {
        let error = {...err};
        // error = err.message;
        // console.log(err);
        // console.log(error);

        if(err.name === "CastError") err = handleErr.handleCastErrorDB(err);
        if(error.message === 'jwt malformed') err = handleErr.handleJWTMalformedErr(error);

        sendErrorProduction(err, req, res);
    }

}