const authorizeRole = (allowedRoles) =>{
    const roles = Array.isArray(allowedRoles)? allowedRoles: [allowedRoles]; //kiểm tra xem allowedRoles có phải là mảng không | Nếu đúng thì giữ nguyên, không đúng thì chuyển nó thành mảng
    return(req,res,next)=>{
        if(!req.user || !req.user.role){
            console.error("Thiếu thông tin để phân quyền")
            return res.status(403).json({
            message: "Ko thể xác định vai trò người dùng để phân quyền"
        })
        }
        const userRole = req.user.role;

        if(!roles.includes(userRole)){ // Trong mảng roles có chứa userRole không?
/** VD:
const roles = ['admin', 'staff', 'user'];
const userRole = 'admin';
roles.includes(userRole); // true
 */
            return res.status(403).json({
            message: "Bạn ko có quyền truy cập tài nguyên"
        })
        }
        next();
        
    }
}

module.exports = authorizeRole;

/**
 VD: gắn trong route
 const authorizeRole = require('../middlewares/authorizeRole');

router.delete('/user/:id',
    authenticate,              // middleware xác thực (decode JWT)
    authorizeRole('admin'),    // 👈 CHỈ admin, nó sẽ gọi lên middleware ở trên để check nếu ok thì tiếp tục
    deleteUser
);
 */