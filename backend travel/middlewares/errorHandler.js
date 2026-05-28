function errorHandlerMiddleware(err, req, res, next) {
    console.log("ERROR", err.stack);
    const status = err.statusCode || err.status || 500;
    res.status(status).json({ message: err.message || "Lỗi server, vui lòng thử lại" });
}
module.exports = errorHandlerMiddleware;