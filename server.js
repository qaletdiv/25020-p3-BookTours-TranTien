require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const requestLoggerMiddleware = require("./middlewares/requestLogger.js");
const errorHandlerMiddleware = require("./middlewares/errorHandler.js");
const config = require("./config/config.js");
const db = require("./models/index.js");
const PORT = process.env.PORT || 3000;

const categoryRoutes = require("./routes/categoryRoutes.js");
const tourRoutes = require("./routes/tourRoutes.js");
const variantRoutes = require("./routes/variantRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://travel-frontend-brown-omega.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLoggerMiddleware);

const limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000,
  message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút",
  standardHeaders: true,
  legacyHeaders: false,
});

const dbconfig = config[config.env];
const sessionStore = new mysqlStore({
  host: dbconfig.host,
  port: dbconfig.port,
  user: dbconfig.username,
  password: dbconfig.password,
  database: dbconfig.database,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
  createDatabaseTable: true,
});
app.use(
  session({
    secret: config.sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  }),
);

app.use("/api", limiter);
app.use("/api/categories", categoryRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/payment", paymentRoutes);

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => res.send("Travel API đang hoạt động!"));

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối database thành công!");
    return db.sequelize.sync({ alter: true });
  })
  .then(() => console.log("Database đã được đồng bộ!"))
  .catch((err) => console.error("Lỗi database:", err));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
