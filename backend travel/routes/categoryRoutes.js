const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator')
const handleValidationErrors = require('../middlewares/ValidationErrorHandler');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);

router.get('/:id',
    param('id').isInt({min:1}).withMessage("ID danh mục phải là số nguyên"),
    handleValidationErrors,
    categoryController.getCatgoryById)

router.post('/',
    [
    body('name')
        .notEmpty().withMessage('Tên danh mục ko được để trống')
        .isLength({ min: 3, max: 255 }).withMessage("Tên danh mục từ 3-255 ký tự")
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Mô tả ko được quá 500 ký tự')
        .trim()
    ],
    handleValidationErrors,
    categoryController.createCategory)

router.put('/:id', categoryController.updateCategory)

router.delete('/:id',categoryController.deleteCategory)

module.exports = router;