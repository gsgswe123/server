// script.js (Frontend)
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Global variables
let currentUser = null;
let userBalance = 0;

// Hàm gọi API chung
async function callApi(endpoint, method = 'GET', body = null, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Format price function
window.formatPrice = function(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Show toast notification
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add('visible');
  }, 100);
  
  setTimeout(function() {
    toast.classList.remove('visible');
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
  
  toast.querySelector('.toast-close').addEventListener('click', function() {
    toast.classList.remove('visible');
    setTimeout(function() {
      toast.remove();
    }, 300);
  });
};

// Authentication functions
async function authenticate(email, password) {
  try {
    const data = await callApi('/users/login', 'POST', { email, password }, false);
    localStorage.setItem('token', data.token);
















    // Also save the user role
    if (data.data.user.role) {
      localStorage.setItem('userRole', data.data.user.role);
    }
    return data.data.user;
  } catch (error) {


    console.error('Login failed:', error);
    throw error; // Re-throw to be caught by the form handler
  }
}




async function registerUser(name, email, password, passwordConfirm) {
  try {


    const data = await callApi('/users/signup', 'POST', {
      name,
      email,
      password,
      passwordConfirm
    }, false);
    localStorage.setItem('token', data.token);
    return data.data.user;
  } catch (error) {















































    console.error('Registration failed:', error);
    throw error;
  }
}



// Product functions
async function loadProducts() {
  try {










































    const data = await callApi('/products');
    const products = data.data.products;
    displayProducts(products); // Call function to display products
  } catch (error) {



    console.error('Failed to load products:', error);
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = '<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>';
    }
  }
}

// Hiển thị sản phẩm trên trang
function displayProducts(productsToDisplay) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    const userRole = localStorage.getItem('userRole'); // Lấy vai trò người dùng

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product-card" data-id="${product.id}">
                <a href="product.html?id=${product.id}">
                    <img src="${API_BASE_URL.replace('/api/v1', '')}${product.image_url}" alt="${
      showError(document.getElementById('registerEmail'), 'Email không hợp lệ');
      isValid = false;
    }
    
    if (!password) {
      showError(document.getElementById('registerPassword'), 'Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (!validatePassword(password)) {
      showError(document.getElementById('registerPassword'), 'Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }
    
    if (!confirmPassword) {
      showError(document.getElementById('registerConfirmPassword'), 'Vui lòng nhập lại mật khẩu');
      isValid = false;
    } else if (confirmPassword !== password) {
      showError(document.getElementById('registerConfirmPassword'), 'Mật khẩu không khớp');
      isValid = false;
    }
    
    if (!isValid) return;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      await registerUser(name, email, password, confirmPassword);
      
      showToast('Đăng ký thành công!', 'success');
      
      setTimeout(function() {
        modalTabs.forEach(t => t.classList.remove('active'));
        document.querySelector('.modal-tab[data-tab="login"]').classList.add('active');
        
        document.querySelectorAll('.modal-form').forEach(form => {
          form.classList.remove('active');
        });
        loginForm.classList.add('active');
        
        document.getElementById('loginEmail').value = email;
        registerForm.reset();
      }, 1000);
    } catch (error) {
      showError(document.getElementById('registerEmail'), error.message || 'Đăng ký thất bại');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
  
  // Forgot password form submission
  forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const submitBtn = this.querySelector('.btn-submit');
    
    if (!email) {
      showError(document.getElementById('forgotEmail'), 'Vui lòng nhập email');
      return;
    } else if (!validateEmail(email)) {
      showError(document.getElementById('forgotEmail'), 'Email không hợp lệ');
      return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(function() {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      showToast('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn!', 'success');
      
      setTimeout(function() {
        forgotModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        forgotPasswordForm.reset();
      }, 1000);
    }, 1500);
  });
  
  // Social login buttons
  document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', function() {
      const provider = this.classList.contains('facebook') ? 'Facebook' : 'Google';
      const submitBtn = this;
      
      submitBtn.innerHTML = '<div class="spinner"></div>';
      
      setTimeout(function() {
        const randomNum = Math.floor(Math.random() * 1000);
        const socialUser = {
          name: `User${randomNum}`,
          email: `user${randomNum}@${provider.toLowerCase()}.com`,
          avatarText: 'U'
        };
        
        currentUser = socialUser;
        updateUIAfterLogin();
        
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        showToast(`Đăng nhập bằng ${provider} thành công`, 'success');
        
        submitBtn.innerHTML = provider === 'Facebook' 
          ? '<i class="fab fa-facebook-f"></i>' 
          : '<i class="fab fa-google"></i>';
      }, 1500);
    });
  });
  
  initPasswordToggles();
  initFormValidation();
}

// Khởi tạo modal tài khoản
function initAccountModal() {
  const accountModal = document.getElementById('accountModal');
  const closeAccountModal = document.getElementById('closeAccountModal');
  const depositAction = document.getElementById('depositAction');
  const logoutAccountBtn = document.getElementById('logoutAccountBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  
  closeAccountModal.addEventListener('click', function() {
    accountModal.classList.remove('show');
    setTimeout(() => {
      accountModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  });
  
  depositAction.addEventListener('click', function() {
    accountModal.classList.remove('show');
    setTimeout(() => {
      accountModal.style.display = 'none';
      showDepositModal();
    }, 300);
  });
  
  logoutAccountBtn.addEventListener('click', function() {
    accountModal.classList.remove('show');
    setTimeout(() => {
      accountModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      logoutUser();
    }, 300);
  });
  
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', function() {
      showChangePasswordModal();
    });
  }
  
  accountModal.addEventListener('click', function(e) {
    if (e.target === accountModal) {
      accountModal.classList.remove('show');
      setTimeout(() => {
        accountModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  });
}

// Hiển thị modal nạp tiền
function showDepositModal() {
  const depositModal = document.getElementById('depositModal');
  
  depositModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    depositModal.classList.add('show');
  }, 10);
  
  document.querySelectorAll('.card-type').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.card-type').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  document.getElementById('depositForm').addEventListener('submit', function(e) {
    e.preventDefault();
    processDeposit();
  });
  
  document.getElementById('closeDepositModal').addEventListener('click', function() {
    depositModal.classList.remove('show');
    setTimeout(() => {
      depositModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.getElementById('depositForm').reset();
    }, 300);
  });
  
  depositModal.addEventListener('click', function(e) {
    if (e.target === depositModal) {
      depositModal.classList.remove('show');
      setTimeout(() => {
        depositModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('depositForm').reset();
      }, 300);
    }
  });
}

// Hiển thị modal đổi mật khẩu
function showChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  document.getElementById('changePasswordForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
      showToast("Mật khẩu mới không khớp", "error");
      return;
    }
    
    if (newPassword.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }
    
    try {
      const response = await callApi('/users/updateMyPassword', 'PATCH', {
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: confirmNewPassword
      });
      
      showToast("Đổi mật khẩu thành công", "success");
      
      setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
          this.reset();
        }, 300);
      }, 1000);
    } catch (error) {
      showToast(error.message || "Đổi mật khẩu thất bại", "error");
    }
  };
  
  document.getElementById('closeChangePasswordModal').addEventListener('click', function() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.getElementById('changePasswordForm').reset();
    }, 300);
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('changePasswordForm').reset();
      }, 300);
    }
  });
}

// Hiển thị modal coming soon
function showComingSoonModal() {
  const comingSoonModal = document.getElementById('comingSoonModal');
  
  comingSoonModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    comingSoonModal.classList.add('show');
  }, 10);
  
  document.getElementById('closeComingSoonModal').addEventListener('click', function() {
    comingSoonModal.classList.remove('show');
    setTimeout(() => {
      comingSoonModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  });
  
  comingSoonModal.addEventListener('click', function(e) {
    if (e.target === comingSoonModal) {
      comingSoonModal.classList.remove('show');
      setTimeout(() => {
        comingSoonModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  });
}

// Back to Top Button
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Khởi tạo khi DOM được tải
document.addEventListener('DOMContentLoaded', function() {
  initBackToTopButton();
  
  // Kiểm tra đăng nhập khi tải trang
  if (localStorage.getItem('rememberMe') === 'true' && localStorage.getItem('token')) {
    updateUIAfterLogin();
  }
  
  // Khởi tạo modal xác thực nếu có nút đăng nhập
  if (document.getElementById('loginButton')) {
    initAuthModal();
  }
  
  // Khởi tạo modal tài khoản nếu có
  if (document.getElementById('accountModal')) {
    initAccountModal();
  }
  
  // Tải sản phẩm nếu ở trang chủ
  if (document.getElementById('productsContainer')) {
    loadProducts();
  }
  
  // Khởi tạo nút lọc sản phẩm
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', filterProducts);
    });
    
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', resetFilters);
    }
  }
});

// Hàm lọc sản phẩm (giữ nguyên từ code gốc)
function filterProducts() {
  console.log('Filtering products...');
}

// Hàm reset bộ lọc (giữ nguyên từ code gốc)
function resetFilters() {
  console.log('Resetting filters...');
}
































}

// Hàm đăng ký
async function register(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;

    try {
        await callApi('/users/register', 'POST', { email, phone, password }, false);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        showLogin();
    } catch (error) {
        alert(`Đăng ký thất bại: ${error.message}`);
    }
}

// Logic chuyển đổi form trên trang tài khoản
let loginForm;
let registerForm;
let indicator;

function showLogin() {
    loginForm.style.transform = "translateX(0px)";
    registerForm.style.transform = "translateX(300px)";
    registerForm.style.opacity = "0";
    loginForm.style.opacity = "1";
    indicator.style.transform = "translateX(0px)";
}

function showRegister() {
    loginForm.style.transform = "translateX(-300px)";
    registerForm.style.transform = "translateX(0px)";
    loginForm.style.opacity = "0";
    registerForm.style.opacity = "1";
    indicator.style.transform = "translateX(100px)";
}

// Khởi tạo các chức năng khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    // Chạy trên mọi trang
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', setDefaultImage);
    });

    // Chạy trên trang chủ (index.html)
    if (document.querySelector('.products-grid')) {
    loadProducts();
  }
  
























    // Chạy trên trang tài khoản (account.html)
    if (window.location.pathname.endsWith('account.html')) {
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        indicator = document.getElementById('indicator');

        if(registerForm) {
             registerForm.style.opacity = "0"; // Mặc định ẩn form đăng ký
        }
    }
});
