const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ============================================================
// HÀM TẠO DỮ LIỆU MẪU BAN ĐẦU (> 250 SẢN PHẨM)
// ============================================================
function generateInitialProducts() {
  const categories = [
    {
      name: 'Bàn phím & Chuột',
      brands: ['Logitech', 'Razer', 'Keychron', 'Corsair', 'Akko', 'Dareu', 'SteelSeries', 'Fuhlen'],
      items: [
        { model: 'Bàn phím cơ không dây', priceBase: 850000, step: 250000 },
        { model: 'Chuột Gaming RGB', priceBase: 350000, step: 150000 },
        { model: 'Bàn phím custom gasket mount', priceBase: 1450000, step: 350000 },
        { model: 'Chuột văn phòng Silent không dây', priceBase: 290000, step: 90000 },
        { model: 'Bàn phím low-profile siêu mỏng', priceBase: 1200000, step: 200000 },
        { model: 'Chuột công thái học chống mỏi cổ tay', priceBase: 890000, step: 180000 }
      ]
    },
    {
      name: 'Màn hình máy tính',
      brands: ['Dell', 'LG', 'ASUS', 'Samsung', 'ViewSonic', 'AOC', 'Gigabyte', 'MSI'],
      items: [
        { model: 'Màn hình 24 inch IPS 75Hz Full HD', priceBase: 2490000, step: 200000 },
        { model: 'Màn hình Gaming 27 inch 165Hz 1ms', priceBase: 4290000, step: 400000 },
        { model: 'Màn hình đồ họa UltraSharp 27 inch 4K', priceBase: 10500000, step: 1200000 },
        { model: 'Màn hình cong Ultrawide 34 inch 2K 144Hz', priceBase: 8990000, step: 900000 },
        { model: 'Màn hình di động cảm ứng 15.6 inch Type-C', priceBase: 3690000, step: 300000 }
      ]
    },
    {
      name: 'Laptop & Máy tính',
      brands: ['Apple', 'Dell', 'Lenovo', 'Asus', 'HP', 'Acer', 'MSI'],
      items: [
        { model: 'Laptop mỏng nhẹ văn phòng Core i5 16GB', priceBase: 14500000, step: 1200000 },
        { model: 'Laptop Gaming RTX 4060 Core i7 16GB', priceBase: 24990000, step: 2500000 },
        { model: 'Máy trạm đồ họa Workstation chuyên nghiệp', priceBase: 32000000, step: 3000000 },
        { model: 'Laptop 2-in-1 màn hình xoay gập OLED', priceBase: 18900000, step: 1500000 },
        { model: 'Mini PC nhỏ gọn tiết kiệm điện', priceBase: 6500000, step: 800000 }
      ]
    },
    {
      name: 'Âm thanh & Tai nghe',
      brands: ['Sony', 'Marshall', 'JBL', 'Audio-Technica', 'Bose', 'Sennheiser', 'Edifier', 'Anker'],
      items: [
        { model: 'Tai nghe Bluetooth chống ồn chủ động ANC', priceBase: 1890000, step: 600000 },
        { model: 'Loa Bluetooth kháng nước di động', priceBase: 950000, step: 350000 },
        { model: 'Tai nghe chụp tai phòng thu kiểm âm', priceBase: 2450000, step: 500000 },
        { model: 'Loa để bàn công suất lớn âm thanh vòm', priceBase: 3100000, step: 700000 },
        { model: 'Tai nghe True Wireless thể thao', priceBase: 690000, step: 200000 }
      ]
    },
    {
      name: 'Linh kiện & Lưu trữ',
      brands: ['Samsung', 'Kingston', 'Corsair', 'Western Digital', 'Seagate', 'Crucial', 'Gigabyte'],
      items: [
        { model: 'Ổ cứng SSD NVMe PCIe 4.0 1TB tốc độ cao', priceBase: 1950000, step: 300000 },
        { model: 'Thanh RAM DDR5 16GB Bus 5600MHz', priceBase: 1350000, step: 250000 },
        { model: 'Ổ cứng di động gắn ngoài 2TB USB 3.2', priceBase: 1890000, step: 200000 },
        { model: 'Nguồn máy tính 750W 80 Plus Gold chuẩn modular', priceBase: 2150000, step: 350000 },
        { model: 'Tản nhiệt nước AIO 240mm RGB', priceBase: 1650000, step: 250000 }
      ]
    },
    {
      name: 'Phụ kiện & Bàn ghế',
      brands: ['Ugreen', 'Baseus', 'Anker', 'Human Motion', 'Epione', 'SteelSeries', 'Sihoo'],
      items: [
        { model: 'Củ sạc nhanh GaN 65W 3 cổng Type-C', priceBase: 490000, step: 100000 },
        { model: 'Hub chuyển đổi đa năng Type-C 8 trong 1', priceBase: 650000, step: 120000 },
        { model: 'Tay nâng màn hình đơn lò xo trợ lực', priceBase: 790000, step: 180000 },
        { model: 'Bàn di chuột phủ vải cỡ lớn kháng nước', priceBase: 250000, step: 70000 },
        { model: 'Ghế công thái học lưới thoáng khí đỡ thắt lưng', priceBase: 2990000, step: 600000 },
        { model: 'Đèn LED treo màn hình bảo vệ mắt chống lóa', priceBase: 450000, step: 90000 }
      ]
    }
  ];

  let idCounter = 1;
  const list = [];

  categories.forEach(cat => {
    cat.items.forEach((item, itemIdx) => {
      cat.brands.forEach((brand, brandIdx) => {
        const price = item.priceBase + (brandIdx * item.step);
        list.push({
          id: idCounter++,
          name: `${item.model} ${brand} Series ${(brandIdx + 1) * 10}`,
          price: price,
          category: cat.name
        });
      });
    });
  });

  return list;
}

// Khởi tạo bộ nhớ danh sách sản phẩm
let products = generateInitialProducts();
console.log(`Đã khởi tạo kho hàng mẫu với ${products.length} sản phẩm.`);

// ============================================================
// CÁC ENDPOINT API (CRUD & SEARCH)
// ============================================================

// 1. Lấy danh mục sản phẩm
// GET /api/categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ success: true, data: categories });
});

// 2. Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc danh mục, phân trang)
// GET /api/products?q=...&category=...&page=1&limit=12
app.get('/api/products', (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    let results = [...products];

    // Lọc theo từ khóa (nếu có)
    if (q && q.trim()) {
      const keyword = q.trim().toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(keyword));
    }

    // Lọc theo danh mục (nếu có)
    if (category && category.trim() && category !== 'all') {
      results = results.filter(p => p.category === category.trim());
    }

    const total = results.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const totalPages = Math.ceil(total / limitNum) || 1;

    // Cắt dữ liệu theo trang
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = results.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: paginatedItems
    });
  } catch (error) {
    console.error('Lỗi GET /api/products:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sản phẩm!' });
  }
});

// 3. Endpoint tìm kiếm sản phẩm (tương thích ngược với bài tập ban đầu)
// GET /api/products/search?q=...
app.get('/api/products/search', (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim().toLowerCase() : '';

    if (!query) {
      return res.json({
        success: true,
        message: 'Vui lòng nhập từ khóa để tìm kiếm.',
        data: []
      });
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(query));

    return res.json({
      success: true,
      query: query,
      total: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('Lỗi GET /api/products/search:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tìm kiếm!' });
  }
});

// 4. Thêm sản phẩm mới (CREATE)
// POST /api/products
app.post('/api/products', (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Validate
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống!' });
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm phải là một số hợp lệ >= 0!' });
    }

    // Tự sinh ID lớn nhất + 1
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = {
      id: maxId + 1,
      name: name.trim(),
      price: numPrice,
      category: category && category.trim() ? category.trim() : 'Khác'
    };

    // Đưa sản phẩm mới lên đầu danh sách để dễ quan sát
    products.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      data: newProduct
    });
  } catch (error) {
    console.error('Lỗi POST /api/products:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm sản phẩm!' });
  }
});

// 5. Cập nhật sản phẩm (UPDATE)
// PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, price, category } = req.body;

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm có ID: ${id}` });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống!' });
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm phải là một số hợp lệ >= 0!' });
    }

    // Cập nhật thông tin
    products[productIndex].name = name.trim();
    products[productIndex].price = numPrice;
    if (category && category.trim()) {
      products[productIndex].category = category.trim();
    }

    return res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: products[productIndex]
    });
  } catch (error) {
    console.error('Lỗi PUT /api/products/:id:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật sản phẩm!' });
  }
});

// 6. Xóa sản phẩm (DELETE)
// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm có ID: ${id}` });
    }

    const removedProduct = products.splice(productIndex, 1)[0];

    return res.json({
      success: true,
      message: `Đã xóa thành công sản phẩm: "${removedProduct.name}"`,
      data: removedProduct
    });
  } catch (error) {
    console.error('Lỗi DELETE /api/products/:id:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa sản phẩm!' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server dang chay tai: http://localhost:${PORT}`);
});
