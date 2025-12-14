import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Đảm bảo đã import cors
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";

// Import các route chính của ứng dụng (nếu có)
import routes from "./src/routes/index.js"; // Giữ nguyên nếu bạn có các route chung khác

// Import các route liên quan đến thanh toán
import paymentRoutes from "./src/routes/paymentRoutes.js"; // Đảm bảo đường dẫn và export đúng ES Modules

const app = express();

// =========================================================
// CẤU HÌNH CORS (ĐẢM BẢO CHỈ CÓ DUY NHẤT MỘT LẦN GỌI NÀY TRONG TOÀN BỘ PROJECT)
// =========================================================
app.use(cors({
    origin: 'http://localhost:3000', // <-- ĐÃ SỬA LẠI THÀNH CỔNG 3000 THEO XÁC NHẬN CỦA BẠN
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookie/header xác thực
}));
// =========================================================
// KẾT THÚC CẤU HÌNH CORS (KHÔNG THÊM app.use(cors) NÀO KHÁC NỮA)
// =========================================================


// Middleware để phân tích body của request
app.use(express.json()); // Thay thế body-parser.json()
app.use(express.urlencoded({ extended: false })); // Thay thế body-parser.urlencoded()
app.use(cookieParser());

// Sử dụng các route liên quan đến thanh toán
// Mọi request đến /api/payment/... sẽ được xử lý bởi paymentRoutes
app.use('/api/payment', paymentRoutes);

// Sử dụng các route API chính của ứng dụng (ví dụ: /api/v1/users, /api/v1/movies)
app.use("/api/v1", routes); // Giữ nguyên nếu bạn có các route chung khác

// Định nghĩa một route gốc đơn giản để kiểm tra server có đang chạy không
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Cổng mà server sẽ lắng nghe
const port = process.env.PORT || 5000;

// Tạo server HTTP
const server = http.createServer(app);

// Kết nối đến MongoDB và khởi động server
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.log({ err });
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
});
