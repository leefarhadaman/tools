class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleJSONParseError = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: 'fail',
            error: 'Invalid JSON payload',
            details: err.message
        });
    }
    next(err);
};

const handleValidationError = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'fail',
            error: 'Validation Error',
            details: err.message
        });
    }
    next(err);
};

const handleTypeError = (err, req, res, next) => {
    if (err instanceof TypeError) {
        return res.status(400).json({
            status: 'fail',
            error: 'Type Error',
            details: err.message
        });
    }
    next(err);
};

const handleURLError = (err, req, res, next) => {
    if (err instanceof URIError) {
        return res.status(400).json({
            status: 'fail',
            error: 'Invalid URL',
            details: err.message
        });
    }
    next(err);
};

const handleAxiosError = (err, req, res, next) => {
    if (err.isAxiosError) {
        return res.status(err.response?.status || 500).json({
            status: 'fail',
            error: 'External API Error',
            details: err.message,
            code: err.code
        });
    }
    next(err);
};

const handleStreamError = (err, req, res, next) => {
    if (err.code === 'ERR_STREAM_WRITE_AFTER_END') {
        return res.status(500).json({
            status: 'error',
            error: 'Stream Error',
            details: 'Error processing stream data'
        });
    }
    next(err);
};

const handleAppError = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err.message
        });
    }
    next(err);
};

const handleUnknownError = (err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        status: 'error',
        error: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message, stack: err.stack })
    });
};

module.exports = {
    AppError,
    errorMiddleware: [
        handleJSONParseError,
        handleValidationError,
        handleTypeError,
        handleURLError,
        handleAxiosError,
        handleStreamError,
        handleAppError,
        handleUnknownError
    ]
}; 