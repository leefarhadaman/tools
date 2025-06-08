const rateLimit = require('express-rate-limit');

const defaultLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'fail',
        error: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        status: 'fail',
        error: 'Too many requests from this IP, please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const lenientLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: {
        status: 'fail',
        error: 'Too many requests from this IP, please try again after 5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    defaultLimiter,
    strictLimiter,
    lenientLimiter
}; 