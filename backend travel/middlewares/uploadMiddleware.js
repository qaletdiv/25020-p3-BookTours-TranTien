const multer = require('multer'); // Thư viện xử lý upload file
const path = require('path'); // Thư viện có sẵn của Node.js dùng để nối đường dẫn đúng chuẩn trên mọi hệ điều hành

//Cấu hình file 
const multerStorage = multer.diskStorage({ //Multer cho phép lưu file ở đĩa diskStorage
    destination:(req,file,cb)=>{ // Chọn nơi lưu file
        const tempPath = path.join(__dirname,"..",'public','temp'); // Tạo đường dẫn đến thư mục tạm thời để lưu file C:\Users\Asus\Code-Learning\Nodejs\Bai7\Bai7\public\temp
        cb(null,tempPath); // Chọn nơi lưu file
    },
    filename: (req,file,cb)=>{ // Tạo tên file duy nhất để tránh trùng lặp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1E9); // Tạo chuỗi duy nhất bằng cách kết hợp timestamp và số ngẫu nhiên
        const ext = path.extname(file.originalname);
        // extname: hàm của Node.js dùng để lấy phần đuôi của file VD: path.extname("cat.png") -> Lấy '.png'
        // file.originalname là tên gốc của file được người dùng upload lên VD: "cat.png"
        cb(null,`img-${uniqueSuffix}${ext}`) // Tạo tên file mới theo định dạng: img-<uniqueSuffix>.<ext> VD: img-1623456789012-123456789.png
    }
})

//Tạo file filter
const multerFilter = (req,file,cb)=>{ // kiểm tra file trước khi upload
    if(file.mimetype.startsWith('image')){ // mimetype là loại file (VD: image/jpeg, video/mp4,...) | startsWith('image'): bắt đầu bằng 'image' nghĩa là file đó là ảnh
        cb(null,true); //không lỗi, cho phép upload
    }else{ 
        cb(new Error('Ko phải là ảnh, hãy upload lại'),false) // lỗi, không cho phép upload
    }
}
//Khởi tạo multer
const upload = multer({
    storage: multerStorage, // Sử dụng cấu hình lưu trữ đã tạo
    fileFilter: multerFilter, // Sử dụng bộ lọc file đã tạo
    limits: {fileSize: 5*1024*1024} // Giới hạn kích thước file tối đa là 5MB (5*1024*1024 bytes) để tránh người dùng upload file quá lớn
})

exports.uploadSingleImage = (fileName) => upload.single(fileName);

exports.uploadMultipleImages = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);
// upload.single(fileName) là middleware của multer để xử lý upload một file với tên trường là fileName (VD: 'avatar') 
// Middleware này sẽ được sử dụng trong route để xử lý upload ảnh đại diện người dùng
// VD: uploadSingleImage("avatar") thành upload.single("avatar")
// | Middleware          | Upload                |
// | ------------------- | --------------------- |
// | `single("image")`   | 1 file                |
// | `array("images",5)` | nhiều file cùng field |
// | `fields()`          | nhiều loại field      |
// | `any()`             | mọi file              |
