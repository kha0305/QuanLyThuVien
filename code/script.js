// Địa chỉ gốc của API Express.js
const API_BASE = window.location.port === '3000' 
  ? '/api' 
  : 'http://localhost:3000/api';

// Bộ biểu tượng SVG chuẩn (Vector Icons)
const ICONS = {
  edit: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  delete: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  plus: `<svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  prev: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  next: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  loading: `<svg class="icon icon-lg icon-spin" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
  empty: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  error: `<svg class="icon icon-lg error-box-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  toastSuccess: `<svg class="icon toast-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  toastError: `<svg class="icon toast-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
};

// Quản lý trạng thái ứng dụng (State)
let currentPage = 1;
const pageSize = 12;
let currentKeyword = '';
let currentCategory = 'all';

// Các phần tử DOM
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const categoryDatalist = document.getElementById('categoryDatalist');
const btnResetFilter = document.getElementById('btnResetFilter');
const totalBadge = document.getElementById('totalBadge');
const productGrid = document.getElementById('productGrid');
const paginationContainer = document.getElementById('paginationContainer');

// Modal Elements
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategoryInput = document.getElementById('productCategory');
const btnOpenCreateModal = document.getElementById('btnOpenCreateModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const toastContainer = document.getElementById('toastContainer');

// ============================================================
// TIỆN ÍCH (HELPER FUNCTIONS)
// ============================================================

// Định dạng tiền tệ VNĐ
function formatCurrency(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

// Hiển thị thông báo nổi (Toast Notification) với SVG icon
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    ${type === 'success' ? ICONS.toastSuccess : ICONS.toastError}
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// TẢI DỮ LIỆU TỪ SERVER (FETCH API)
// ============================================================

// 1. Tải danh mục sản phẩm
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      // Đổ vào thẻ <select>
      categoryFilter.innerHTML = '<option value="all">Tất cả danh mục</option>' +
        json.data.map(cat => `<option value="${cat}">${cat}</option>`).join('');

      // Đổ vào <datalist> gợi ý khi thêm/sửa
      categoryDatalist.innerHTML = json.data.map(cat => `<option value="${cat}">`).join('');
    }
  } catch (error) {
    console.warn('Chưa lấy được danh mục:', error);
  }
}

// 2. Tải danh sách sản phẩm theo bộ lọc & phân trang
async function loadProducts(page = 1) {
  currentPage = page;

  // Hiển thị trạng thái đang tải với SVG spinner
  productGrid.innerHTML = `
    <div class="status-box">
      <div class="status-icon-wrapper">${ICONS.loading}</div>
      <div class="status-title">Đang tải dữ liệu...</div>
      <div class="status-desc">Hệ thống đang tải danh sách sản phẩm từ máy chủ.</div>
    </div>
  `;
  paginationContainer.innerHTML = '';

  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: pageSize,
      q: currentKeyword,
      category: currentCategory
    });

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    
    if (!res.ok) {
      throw new Error(`Mã lỗi HTTP: ${res.status}`);
    }

    const json = await res.json();

    if (json.success) {
      totalBadge.textContent = `Tổng: ${json.total} sản phẩm`;

      if (json.data.length === 0) {
        renderEmptyState();
      } else {
        renderProductGrid(json.data);
        renderPagination(json.page, json.totalPages, json.total);
      }
    } else {
      renderErrorState(json.message);
    }
  } catch (error) {
    console.error('Lỗi khi fetch products:', error);
    totalBadge.textContent = 'Mất kết nối';
    renderErrorState('Không thể kết nối đến máy chủ Express.js. Vui lòng kiểm tra lại server có đang chạy tại cổng 3000 không!');
  }
}

// ============================================================
// RENDER GIAO DIỆN (UI RENDERING)
// ============================================================

// Render thẻ sản phẩm với SVG icons cho Sửa và Xóa
function renderProductGrid(products) {
  productGrid.innerHTML = products.map(product => `
    <div class="product-card" id="product-${product.id}">
      <div>
        <div class="card-top">
          <span class="card-id">#${product.id}</span>
          <span class="card-category">${product.category || 'Chưa phân loại'}</span>
        </div>
        <h3 class="card-name" title="${product.name}">${product.name}</h3>
      </div>
      <div class="card-bottom">
        <div class="card-price">${formatCurrency(product.price)}</div>
        <div class="card-actions">
          <button class="btn-action btn-edit" onclick="openEditModal(${product.id})" title="Chỉnh sửa sản phẩm">
            ${ICONS.edit}
            <span>Sửa</span>
          </button>
          <button class="btn-action btn-delete" onclick="handleDeleteProduct(${product.id}, '${product.name.replace(/'/g, "\\'")}')" title="Xóa sản phẩm">
            ${ICONS.delete}
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render trạng thái không có sản phẩm với SVG Box
function renderEmptyState() {
  productGrid.innerHTML = `
    <div class="status-box">
      <div class="status-icon-wrapper">${ICONS.empty}</div>
      <div class="status-title">Không tìm thấy sản phẩm nào</div>
      <div class="status-desc">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</div>
    </div>
  `;
}

// Render trạng thái lỗi kết nối với SVG Alert
function renderErrorState(message) {
  productGrid.innerHTML = `
    <div class="error-box">
      ${ICONS.error}
      <div>
        <strong>Lỗi kết nối máy chủ!</strong>
        <p style="font-size: 0.9rem; margin-top: 4px;">${message}</p>
      </div>
    </div>
  `;
}

// Render các nút phân trang với SVG chevrons
function renderPagination(page, totalPages, totalItems) {
  if (totalPages <= 1) return;

  let html = `
    <button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="loadProducts(${page - 1})">
      ${ICONS.prev}
      <span>Trước</span>
    </button>
  `;

  // Hiển thị tối đa 5 nút trang
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  if (startPage > 1) {
    html += `<button class="page-btn" onclick="loadProducts(1)">1</button>`;
    if (startPage > 2) html += `<span class="page-info">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button class="page-btn ${i === page ? 'active' : ''}" onclick="loadProducts(${i})">
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="page-info">...</span>`;
    html += `<button class="page-btn" onclick="loadProducts(${totalPages})">${totalPages}</button>`;
  }

  html += `
    <button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="loadProducts(${page + 1})">
      <span>Sau</span>
      ${ICONS.next}
    </button>
    <span class="page-info">Trang ${page} / ${totalPages}</span>
  `;

  paginationContainer.innerHTML = html;
}

// ============================================================
// CHỨC NĂNG THÊM & SỬA SẢN PHẨM (CREATE & UPDATE)
// ============================================================

// Mở modal Thêm mới
function openCreateModal() {
  modalTitle.innerHTML = `
    ${ICONS.plus}
    <span>Thêm sản phẩm mới</span>
  `;
  productIdInput.value = '';
  productForm.reset();
  productModal.classList.add('active');
  productNameInput.focus();
}

// Mở modal Sửa thông tin
async function openEditModal(id) {
  try {
    const card = document.getElementById(`product-${id}`);
    if (!card) return;

    modalTitle.innerHTML = `
      ${ICONS.edit}
      <span>Cập nhật sản phẩm #${id}</span>
    `;
    productIdInput.value = id;
    
    // Đọc thông tin từ card hiện tại
    const name = card.querySelector('.card-name').textContent;
    const category = card.querySelector('.card-category').textContent;
    const priceText = card.querySelector('.card-price').textContent;
    const cleanPrice = priceText.replace(/[^\d]/g, '');

    productNameInput.value = name;
    productPriceInput.value = cleanPrice;
    productCategoryInput.value = category === 'Chưa phân loại' ? '' : category;

    productModal.classList.add('active');
    productNameInput.focus();
  } catch (error) {
    console.error('Lỗi khi mở form sửa:', error);
  }
}

// Đóng modal
function closeModal() {
  productModal.classList.remove('active');
  productForm.reset();
}

// Xử lý gửi Form Thêm / Sửa
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = productIdInput.value;
  const isEditing = Boolean(id);

  const payload = {
    name: productNameInput.value.trim(),
    price: Number(productPriceInput.value),
    category: productCategoryInput.value.trim() || 'Khác'
  };

  try {
    const url = isEditing ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Thao tác không thành công!');
    }

    showToast(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!', 'success');
    closeModal();
    
    await loadCategories();
    loadProducts(isEditing ? currentPage : 1);
  } catch (error) {
    console.error('Lỗi khi lưu sản phẩm:', error);
    showToast(error.message || 'Không thể lưu sản phẩm. Vui lòng thử lại!', 'error');
  }
});

// ============================================================
// CHỨC NĂNG XÓA SẢN PHẨM (DELETE)
// ============================================================

async function handleDeleteProduct(id, name) {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa sản phẩm:\n"${name}" (ID: #${id})?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Không thể xóa sản phẩm.');
    }

    showToast(`Đã xóa sản phẩm #${id} thành công!`, 'success');
    loadProducts(currentPage);
  } catch (error) {
    console.error('Lỗi khi xóa:', error);
    showToast(error.message || 'Lỗi khi xóa sản phẩm!', 'error');
  }
}

// ============================================================
// LẮNG NGHE SỰ KIỆN GIAO DIỆN (EVENT LISTENERS)
// ============================================================

// Tìm kiếm từ khóa
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentKeyword = searchInput.value.trim();
  loadProducts(1);
});

// Lọc theo danh mục
categoryFilter.addEventListener('change', (e) => {
  currentCategory = e.target.value;
  loadProducts(1);
});

// Làm mới bộ lọc
btnResetFilter.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  currentKeyword = '';
  currentCategory = 'all';
  loadProducts(1);
});

// Nút mở modal thêm mới
btnOpenCreateModal.addEventListener('click', openCreateModal);

// Nút đóng modal
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);

// Đóng modal khi click ra ngoài
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeModal();
});

// Đóng modal bằng phím ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productModal.classList.contains('active')) {
    closeModal();
  }
});

// Gán hàm vào window để gọi từ HTML
window.openEditModal = openEditModal;
window.handleDeleteProduct = handleDeleteProduct;
window.loadProducts = loadProducts;

// ============================================================
// KHỞI CHẠY LẦN ĐẦU (INIT)
// ============================================================
loadCategories();
loadProducts(1);
