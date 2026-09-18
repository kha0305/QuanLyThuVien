const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Cho phép Front-end gọi API khác domain/port (CORS)
app.use(express.json());
app.use(express.static('.')); // Phục vụ trực tiếp file tĩnh (index.html, script.js)

// Danh sách dữ liệu mẫu (Mock data)
const products = [
  { id: 1, name: 'Bàn phím cơ không dây RK G68', price: 850000 },
  { id: 2, name: 'Chuột Gaming Logitech G102 Lightsync', price: 399000 },
  { id: 3, name: 'Tai nghe chụp tai Sony WH-1000XM5', price: 6990000 },
  { id: 4, name: 'Màn hình Dell UltraSharp U2723QE 4K', price: 11890000 },
  { id: 5, name: 'Bàn di chuột cỡ lớn SteelSeries QcK XXL', price: 790000 },
  { id: 6, name: 'Giá đỡ laptop hợp kim nhôm xoay 360 độ', price: 290000 },
  { id: 7, name: 'Webcam Rapoo C280 2K có mic khử ồn', price: 650000 },
  { id: 8, name: 'Loa Bluetooth Marshall Emberton II', price: 3490000 }
];

// Endpoint tìm kiếm sản phẩm
// GET /api/products/search?q=...
app.get('/api/products/search', (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim().toLowerCase() : '';

    // Nếu không nhập từ khóa, có thể trả về toàn bộ hoặc mảng rỗng tùy nghiệp vụ
    // Ở đây nếu rỗng sẽ trả về danh sách rỗng để người dùng nhập từ khóa
    if (!query) {
      return res.json({
        success: true,
        message: 'Vui lòng nhập từ khóa để tìm kiếm.',
        data: []
      });
    }

    // Lọc sản phẩm theo tên (không phân biệt hoa/thường)
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );

    // Trả về JSON kết quả
    return res.status(200).json({
      success: true,
      query: query,
      total: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    console.error('Lỗi server:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra phía máy chủ!'
    });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
