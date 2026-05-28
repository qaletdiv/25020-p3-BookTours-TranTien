const { validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next(); //ko có lỗi, đi tiếp 
}

module.exports = handleValidationErrors;