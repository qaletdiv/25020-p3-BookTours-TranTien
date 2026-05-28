const express = require("express");
const router = express.Router();

router.get("/set-cookie", (req, res) => {
  res.cookie("username", "guest"); // set cookie với tên "username" và giá trị "guest"
  res.cookie("language", "vietnamese", { maxAge: 900000 }); // 90000 là thời gian tồn tại của cookie tính bằng milliseconds (15 phút)
  res.cookie("sensitiveData", "someToken123", {
    httpOnly: true, // chỉ cho phép truy cập cookie qua HTTP(S), không cho phép JavaScript truy cập để tăng cường bảo mật
    secure: process.env.NODE_ENV === "production", // chỉ gửi cookie qua HTTPS trong môi trường production để bảo vệ dữ liệu khỏi bị đánh cắp qua mạng
    sameSite: "strict", //chống tấn công CSRF
  });
  res.json({ message: "Cookie đã được thiết lập" });
});

router.get("/read-cookie", (req, res) => {
  const username = req.cookies.username;
  const language = req.cookies.language;
  const sensitiveData = req.cookies.sensitiveData;
  console.log("Cookies nhận được từ client:", req.cookies);
  res.json({
    username: username,
    language: language,
    sensitiveData: sensitiveData,
  });
});

router.get("/clear-cookie", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("language");
  res.clearCookie("sensitiveData", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Cookie đã được xóa" });
});

module.exports = router;

// Thiết lập cookie trong thực tế với login | Tài khoản không mất, nó chỉ mất cái token do hết hạn thôi
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ where: { email } });
//   if (!user) {
//     return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
//   }
//   const token = jwt.sign(
//     { id: user.id },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
//   res.cookie("accessToken", token, {
//     maxAge: 24 * 60 * 60 * 1000,              // sống 1 ngày (ms)
//     expires: new Date(Date.now() + 86400000), // ngày hết hạn
//     httpOnly: true,                           // JS không đọc được
//     secure: process.env.NODE_ENV === "production", // chỉ gửi qua HTTPS khi production
//     sameSite: "strict",                       // chống CSRF
//     path: "/",                                // cookie dùng cho toàn bộ website
//     domain: "localhost"                       // domain áp dụng cookie
//   });
//   res.json({
//     message: "Login thành công",
//     user: user.username
//   });
// });


//----CÁCH TRIỂN KHAI----//
// A. Frontend: user chọn setting 
// const savePreferences = async () => {
//   await fetch("http://localhost:3000/set-preferences", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     credentials: "include",
//     body: JSON.stringify({
//       language: "vi",
//       theme: "dark",
//       currency: "VND"
//     })
//   });
// };

// B. Backend: API lưu preference của user
// router.post("/set-preferences", (req, res) => {
//   const { language, theme, currency } = req.body;

//   res.cookie("language", language, {
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   });

//   res.cookie("theme", theme, {
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   });

//   res.cookie("currency", currency, {
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   });

//   res.json({
//     message: "Preferences saved"
//   });
// });


// Sau đó, khi user truy cập lại trang web, backend có thể đọc cookie để áp dụng các preferences đã lưu cho user đó. Ví dụ:
// router.get("/preferences", (req, res) => {
//   res.json({
//     language: req.cookies.language || "en",
//     theme: req.cookies.theme || "light",
//     currency: req.cookies.currency || "USD"
//   });
// });

// Frontend: Khi load trang, frontend có thể gọi API để lấy preferences và áp dụng
// useEffect(() => {
//   fetch("/preferences", {
//     credentials: "include" // Đảm bảo gửi cookie cùng với yêu cầu để backend có thể đọc và trả về đúng preferences của user
//   })
//   .then(res => res.json())
//   .then(data => {
//     if (data.theme === "dark") {
//       document.body.classList.add("dark-mode");
//     }
//   });
// }, []);