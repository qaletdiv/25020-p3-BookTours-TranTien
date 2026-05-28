const {User} = require('../models')
 
const authenticateSession = async (req, res, next) => {
    if(req.session && req.session.userId){
        try {
            const user = await User.findByPk(req.session.userId);
            if (!user) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Lỗi khi hủy session:", err);
                    }
                });
                return res.status(401).json({
                    message: "Xác thực thất bại, ko tồn tại người dùng"
                })
            }
            req.user = user; //lấy thông tin mới nhất
            next();     
        } catch (error) {
            console.error("Lỗi truy vấn người dùng trong xác thực");
            res.status(500).json({
                message: "Lỗi máy chủ trong quá trình xác thực"
            })
        }   
    } else {
        return res.status(401).json({
            message: "Yêu cầu đăng nhập để truy cập tài nguyên này"
        })
    }
}
module.exports = authenticateSession
 