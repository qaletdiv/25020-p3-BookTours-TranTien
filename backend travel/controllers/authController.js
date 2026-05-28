const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, phone });
        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return res.status(409).json({
                message: `Lỗi đăng ký`,
                errors: [{ msg: `${field} đã tồn tại.`, param: field }]
            });
        }
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => ({ msg: err.message, param: err.path }));
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: messages });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;
        const user = await User.scope('withPassword').findOne({
            where: {
                [require('sequelize').Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
            }
        });
        if (!user) return res.status(401).json({ message: "Thông tin đăng nhập không chính xác" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mật khẩu không chính xác" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        res.json({
            message: "Đăng nhập thành công",
            accessToken: token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar || null }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res) => {
    res.json({ user: req.user });
};

exports.updateMyAvatar = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Vui lòng upload ảnh" });
    try {
        const avatarPath = `/uploads/${req.file.processedFilename}`;
        await User.update({ avatar: avatarPath }, { where: { id: req.user.id } });
        res.json({ message: "Avatar đã cập nhật", avatarUrl: avatarPath });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: "Đăng xuất thành công" });
        });
    } else {
        res.json({ message: "Đăng xuất thành công" });
    }
};
