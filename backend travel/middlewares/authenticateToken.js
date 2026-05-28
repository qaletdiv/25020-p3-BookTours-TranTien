const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Client sẽ gửi request kiểu: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const token = authHeader && authHeader.split(' ')[1]; // split(' ') sẽ tách, Lấy phần tử 2: ["Bearer", "token"] => Lấy token
    console.log(token);
    if (token == null) {
        return res.status(401).json({
            message: "Yêu cầu token để xác thực"
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => { // kiểm tra token có hợp lệ và đúng chữ ký không. sau đó giải mã giải mã payload vào decodedPayload
        if (err) {
            if (err instanceof jwt.TokenExpiredError) { // Nếu lỗi err là lỗi token hết hạn
                return res.status(401).json({
                    message: "Token hết hạn"
                })
            }
            return res.status(403).json({
                message: "Token ko hợp lệ"
            })
        }
        const userId = decodedPayload.userId; // decodedPayload được lấy từ token chứa payload của login gửi lên
        if(!userId){
              return res.status(403).json({
                message: "Token thiếu thông tin người dùng"
            })
        }
        try {
            const user = await User.findByPk(userId);
            if(!user){
                 return res.status(401).json({
                    message: "Xác thực thất bại, ko tồn tại người dùng"
                })
            }
            req.user = user; //lấy thông tin mới nhất tìm được từ database sau khi giải token thì gán vào req.user để sau này lấy dùng
            next();
        } catch (error) {
            console.error("Lỗi truy vấn người dùng trong xác thực");
            next(error)
        }
    })
}

module.exports = authenticateToken