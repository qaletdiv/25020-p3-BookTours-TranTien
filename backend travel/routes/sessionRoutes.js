const express = require('express');
const router = express.Router();
 
//Thiết lập dữ liệu vào session
router.get('/set-session', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    req.session.userData = { name: "Tí", role: "user" };
    req.session.message = "Đây là một session demo";
    res.json({ message: "Session đã được thiết lập.Views: " + req.session.views });
})
//Đọc dữ liệu từ session
router.get('/get-session', (req, res) => {
    if (req.session.views) {
        res.json({
            message: "Session đang tồn tại.",
            views: req.session.views,
            userData: req.session.userData,
            customMessage: req.session.message
        });
    } else {
        res.json({ message: "Session chưa được thiết lập." });
    }
})
//Cập nhật session
router.get('/update-session', (req, res) => {
    if (req.session.userData) {
        req.session.userData.lastSeen = new Date();
        res.json({ message: "Session đã được cập nhật.", userData: req.session.userData });
    } else {
        res.json({ message: "Session chưa được thiết lập." });
    }
})
 
//Xóa session
router.get('/destroy-session', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ message: "Lỗi khi xóa session." });
            } else {
                res.json({ message: "Session đã được xóa." });
            }
        })
    }
    else {
        res.json({ message: "Session chưa được thiết lập." });
    }
}
)
 
module.exports = router;