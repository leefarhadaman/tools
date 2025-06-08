const validateRequiredFields = (fields) => (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            fields: missingFields
        });
    }
    next();
};

const validateStringFields = (fields) => (req, res, next) => {
    const invalidFields = fields.filter(field => 
        req.body[field] && typeof req.body[field] !== 'string'
    );
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: 'Invalid field types',
            fields: invalidFields,
            expected: 'string'
        });
    }
    next();
};

const validateNumberFields = (fields) => (req, res, next) => {
    const invalidFields = fields.filter(field => 
        req.body[field] && typeof req.body[field] !== 'number'
    );
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: 'Invalid field types',
            fields: invalidFields,
            expected: 'number'
        });
    }
    next();
};

const validateURLField = (field) => (req, res, next) => {
    try {
        if (!req.body[field]) {
            return res.status(400).json({
                error: 'Missing URL field',
                field
            });
        }
        new URL(req.body[field]);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid URL format',
            field
        });
    }
};

const validateHexColor = (field) => (req, res, next) => {
    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(req.body[field])) {
        return res.status(400).json({
            error: 'Invalid hex color format',
            field,
            expected: '#RRGGBB or #RGB'
        });
    }
    next();
};

const validateRGBColor = (fields) => (req, res, next) => {
    const { r, g, b } = req.body;
    const isValid = [r, g, b].every(value => 
        typeof value === 'number' && value >= 0 && value <= 255
    );
    if (!isValid) {
        return res.status(400).json({
            error: 'Invalid RGB values',
            expected: 'Numbers between 0 and 255'
        });
    }
    next();
};

const validatePasswordOptions = (req, res, next) => {
    const { length, numbers, symbols, uppercase, lowercase } = req.body;
    if (length && (typeof length !== 'number' || length < 4 || length > 100)) {
        return res.status(400).json({
            error: 'Invalid password length',
            expected: 'Number between 4 and 100'
        });
    }
    const booleanFields = { numbers, symbols, uppercase, lowercase };
    const invalidBooleans = Object.entries(booleanFields)
        .filter(([_, value]) => value !== undefined && typeof value !== 'boolean')
        .map(([key]) => key);
    
    if (invalidBooleans.length > 0) {
        return res.status(400).json({
            error: 'Invalid boolean fields',
            fields: invalidBooleans,
            expected: 'boolean'
        });
    }
    next();
};

module.exports = {
    validateRequiredFields,
    validateStringFields,
    validateNumberFields,
    validateURLField,
    validateHexColor,
    validateRGBColor,
    validatePasswordOptions
}; 