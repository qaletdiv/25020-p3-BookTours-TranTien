const { body, param } = require('express-validator'); // Để nó lấy tắt req.body và req.param
const { Category } = require('../models')

const commonIdParamValidation = () => param('id').isInt({ min: 1 }).withMessage("ID sản phẩm phải là số nguyên")

const categoryExistsValidator = body('categoryId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage("ID danh mục phải là số nguyên")
    .custom(async (value) => {
        if (value) {
            const category = await Category.findByPk(value);
            if (!category) {
                throw new Error("Danh mục ko tồn tại");
            }
        }
        return true; //validation thành công
    })

const createProductValidationRules = () => {
    return [
        body('name')
            .notEmpty().withMessage('Tên sản phẩm ko được để trống')
            .isLength({ min: 3, max: 255 }).withMessage("Tên danh mục từ 3-255 ký tự")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 1000 }).withMessage('Mô tả ko được quá 1000 ký tự')
            .trim(),
        body('price')
            .notEmpty().withMessage('Giá sản phẩm ko được để trống')
            .isFloat({ min: 0 }).withMessage("Giá sản phẩm ko phải là số không âm")
            .toFloat(), //Có thể chuyển đổi thành số thực 
        body('categoryId')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage("ID danh mục phải là số nguyên"),
        categoryExistsValidator
    ]
}

const updatedProductValidationRules = () => {
    return [
        param('id')
            .isInt({ min: 1 })
            .withMessage("ID sản phẩm phải là số nguyên"),
        body('name')
            .optional()
            .notEmpty().withMessage('Tên sản phẩm ko được để trống')
            .isLength({ min: 3, max: 255 }).withMessage("Tên danh mục từ 3-255 ký tự")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 1000 }).withMessage('Mô tả ko được quá 1000 ký tự')
            .trim(),
        body('price')
            .optional()
            .notEmpty().withMessage('Giá sản phẩm ko được để trống')
            .isFloat({ min: 0 }).withMessage("Giá sản phẩm ko phải là số không âm")
            .toFloat(), //Có thể chuyển đổi thành số thực 
        body('categoryId')
            .optional({ nullable: true })
            .isInt({ min: 1 }).withMessage("ID danh mục phải là số nguyên"),
        categoryExistsValidator
    ]
}

module.exports = {
    createProductValidationRules,
    updatedProductValidationRules,
    commonIdParamValidation
}