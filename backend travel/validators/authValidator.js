const { body, param } = require('express-validator');

const commonIdParamValidation = () => param('id').isInt({ min: 1 }).withMessage("ID user phải là số nguyên")


const registerValidationRules = () => {
    return [
        body('username')
            .notEmpty().withMessage('Username ko được để trống')
            .isLength({ min: 3, max: 50 }).withMessage("Tên username từ 3-50 ký tự")
            .trim(),
        body('email')
            .notEmpty().withMessage('email ko được để trống')
            .isEmail().withMessage('Email ko hợp lệ')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('password ko được để trống')
            .isLength({ min: 6 }).withMessage("Password có ít nhất 6 ký tự"),
        body('phone')
            .optional()
            .matches(/^[0-9]{10}$/).withMessage('Số điện thoại phải đúng 10 chữ số')
    ]
}

const loginValidationRules = ()=>{
    return[
        body('emailOrUsername')
            .notEmpty().withMessage('Email hoặc Username ko được để trống'),
        body('password')
            .notEmpty().withMessage('password ko được để trống')
            .isLength({ min: 6 }).withMessage("Password có ít nhất 6 ý tự")
    ]
}



module.exports = {
    registerValidationRules,
    commonIdParamValidation,
    loginValidationRules
}