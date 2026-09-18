// Địa chỉ API của backend Express.js
// Nếu chạy file tĩnh qua cổng 3000 (Express static) thì dùng đường dẫn tương đối, nếu mở qua Live Server thì trỏ về localhost:3000
const API_URL = window.location.port === '3000' 
  ? '/api/products/search' 
  : 'http://localhost:3000/api/products/search';

// Lấy các phần tử DOM
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const btnText = document.getElementById('btnText');
const resultsContainer = document.getElementById('resultsContainer');

// Hàm format giá tiền sang định dạng tiền tệ Việt Nam (VND)
function formatCurrency(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

// Bật/tắt trạng thái đang tải (Loading state)
function setLoading(isLoading) {
  if (isLoading) {
    searchBtn.disabled = true;
    btnText.innerHTML = '<span class="loading-spinner"></span> Đang tìm...';
  } else {
    searchBtn.disabled = false;
    btnText.textContent = 'Tìm kiếm';
  }
}

// Hiển thị giao diện khi không tìm thấy kết quả (Empty state)
function renderEmptyState(message) {
  resultsContainer.innerHTML = `
    <div class="status-box">
      <div class="status-icon">📦</div>
      <div class="status-title">Không tìm thấy sản phẩm</div>
      <div class="status-desc">${message || 'Không có sản phẩm nào khớp với từ khóa của bạn.'}</div>
    </div>
  `;
}

// Hiển thị thông báo lỗi khi server sập hoặc lỗi mạng (Error state)
function renderErrorState(errorMessage) {
  resultsContainer.innerHTML = `
    <div class="error-box">
      <span class="error-icon">⚠️</span>
      <div>
        <strong>Lỗi kết nối máy chủ!</strong>
        <p style="font-size: 0.9rem; margin-top: 4px;">
          ${errorMessage || 'Không thể kết nối đến máy chủ Express.js. Vui lòng kiểm tra lại xem server đã được khởi động chưa.'}
        </p>
      </div>
    </div>
  `;
}

// Render danh sách sản phẩm ra HTML
function renderProductList(products) {
  const html = products.map(product => `
    <div class="product-card">
      <div class="product-info">
        <span class="product-id">Mã SP: #${product.id}</span>
        <h3 class="product-name">${product.name}</h3>
      </div>
      <div class="product-price">${formatCurrency(product.price)}</div>
    </div>
  `).join('');

  resultsContainer.innerHTML = html;
}

// Hàm gửi request tìm kiếm
async function handleSearch(keyword) {
  const trimmedKeyword = keyword.trim();

  // Kiểm tra nếu người dùng chưa nhập từ khóa
  if (!trimmedKeyword) {
    renderEmptyState('Vui lòng nhập từ khóa vào ô tìm kiếm.');
    return;
  }

  setLoading(true);

  try {
    // Gửi request API bằng fetch() trong JavaScript thuần
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(trimmedKeyword)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Kiểm tra phản hồi HTTP từ server
    if (!response.ok) {
      throw new Error(`Server trả về mã lỗi: ${response.status} (${response.statusText})`);
    }

    const result = await response.json();

    // Kiểm tra kết quả trả về từ API
    if (result.success && Array.isArray(result.data)) {
      if (result.data.length === 0) {
        renderEmptyState(`Không tìm thấy sản phẩm nào khớp với "${trimmedKeyword}".`);
      } else {
        renderProductList(result.data);
      }
    } else {
      renderErrorState(result.message || 'Dữ liệu trả về không hợp lệ.');
    }

  } catch (error) {
    // Bắt lỗi khi server sập (Connection refused), timeout hoặc mất mạng
    console.error('Lỗi khi fetch API:', error);
    renderErrorState('Không thể kết nối đến máy chủ Express.js (Server có thể đang bị tắt hoặc gặp sự cố).');
  } finally {
    setLoading(false);
  }
}

// Bắt sự kiện submit form (khi bấm nút Tìm kiếm hoặc nhấn Enter)
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});
