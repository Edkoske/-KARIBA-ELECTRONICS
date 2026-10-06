const initPage = () => {
  setupNavigation();
  setupFormValidation();
  setupSearch();

  const page = document.body.dataset.page;

  if (page === 'home') {
    renderCategoryCards();
    renderFeaturedProducts();
  }

  if (page === 'shop') {
    renderShopPage();
  }

  if (page === 'product') {
    renderProductDetailPage();
  }

  if (page === 'contact') {
    setupContactPage();
  }
};

function setupNavigation() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(mainNav.classList.contains('open')));
    });
  }

  document.querySelectorAll('.main-nav a').forEach((link) => {
    if (window.location.pathname.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
}

function setupSearch() {
  const globalSearch = document.getElementById('headerSearch');
  const searchForm = document.getElementById('searchForm');

  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = (globalSearch ? globalSearch.value : '').trim();
      const target = value ? `shop.html?search=${encodeURIComponent(value)}` : 'shop.html';
      window.location.href = target;
    });
  }
}

function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  const featuredProducts = (window.KARIBA_PRODUCTS || []).filter((product) => product.featured).slice(0, 8);
  container.innerHTML = featuredProducts.map(productCardTemplate).join('');
}


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function safeImageUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === 'https:' || url.origin === window.location.origin) {
      return escapeHTML(url.href);
    }
  } catch {
    return '';
  }

  return '';
}

function renderCategoryCards() {
  const container = document.getElementById('categoryGrid');
  if (!container) return;

  container.innerHTML = (window.KARIBA_CATEGORIES || []).map((category) => `
    <article class="category-card">
      <img src="${safeImageUrl(category.image)}" alt="${escapeHTML(category.name)} products" loading="lazy" referrerpolicy="no-referrer" />
      <div class="content">
        <h3>${escapeHTML(category.name)}</h3>
        <p>${escapeHTML(category.description)}</p>
        <details class="category-items">
          <summary>Browse ${Number(category.items.length)} product types</summary>
          <ul>${category.items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        </details>
        <a href="shop.html?category=${encodeURIComponent(category.name)}" class="btn secondary-btn">View Category</a>
      </div>
    </article>
  `).join('');
}

function openWhatsAppEnquiry(productName, message = '') {
  const productText = message ? `${message}. ` : '';
  const details = `Hello Kariba Electronics, I am interested in ${productName}. ${productText}Please share availability, pricing and delivery details.`;
  const number = String(window.KARIBA_COMPANY.whatsappNumber).replace(/\D/g, '');
  const url = `https://wa.me/${number}?text=${encodeURIComponent(details)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function sendProductEmail(productName) {
  const subject = `Product enquiry: ${productName}`;
  const body = `Hello Kariba Electronics,\n\nI am interested in ${productName}. Please share pricing, availability, and delivery details.\n\nThank you.`;
  window.location.href = gmailComposeUrl(subject, body);
}

function productEmailUrl(productName) {
  const subject = `Product enquiry: ${productName}`;
  const body = `Hello Kariba Electronics,\n\nI am interested in ${productName}. Please share pricing, availability, and delivery details.\n\nThank you.`;
  return gmailComposeUrl(subject, body);
}

function gmailComposeUrl(subject, body) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: window.KARIBA_COMPANY.email,
    su: subject,
    body
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function renderShopPage() {
  const container = document.getElementById('shopProducts');
  const categoryFilter = document.getElementById('categoryFilter');
  const categoryLinks = document.getElementById('shopCategoryLinks');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('shopSearch');

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search') || '';
  const categoryParam = params.get('category') || '';

  if (searchInput) {
    searchInput.value = searchParam;
  }

  const categories = window.KARIBA_CATEGORIES || [];

  if (categoryLinks) {
    categoryLinks.innerHTML = categories.map((category) =>
      `<a href="shop.html?category=${encodeURIComponent(category.name)}"><span>${escapeHTML(category.name)}</span></a>`
    ).join('');
  }

  if (categoryFilter) {
    categoryFilter.innerHTML = ['All Categories', ...categories.map((category) => category.name)
    ].map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join('');
    if (categoryParam) {
      categoryFilter.value = categoryParam;
    }
  }

  const applyFilters = () => {
    const term = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const selectedCategory = categoryFilter ? categoryFilter.value : 'All Categories';
    const sortValue = sortSelect ? sortSelect.value : 'featured';

    let filtered = [...(window.KARIBA_PRODUCTS || [])];

    if (term) {
      filtered = filtered.filter((product) => {
        const haystack = [product.name, product.category, product.description].join(' ').toLowerCase();
        return haystack.includes(term);
      });
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (categoryFilter && categoryParam && selectedCategory === 'All Categories') {
      categoryFilter.value = categoryParam;
    }

    switch (sortValue) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popular || 0) - (a.popular || 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state">No products match your search filters. Please try another keyword or category.</div>';
      return;
    }

    container.innerHTML = filtered.map(productCardTemplate).join('');
  };

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  applyFilters();
}

function renderProductDetailPage() {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = (window.KARIBA_PRODUCTS || []).find((item) => Number(item.id) === productId);

  if (!product) {
    container.innerHTML = '<div class="empty-state">This product is not available. Please browse other items in the shop.</div>';
    return;
  }

  const buildDetailMarkup = () => `
    <div class="product-detail-wrap">
      <div class="product-gallery">
        <img src="${safeImageUrl(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" referrerpolicy="no-referrer">
      </div>
      <div class="product-info">
        <div class="product-badge">${escapeHTML(product.availability)}</div>
        <h1>${escapeHTML(product.name)}</h1>
        <div class="rating-row">
          <span class="stars">${renderStars(product.rating)}</span>
          <span>${product.rating} / 5</span>
        </div>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <ul class="spec-list">
          ${Object.entries(product.specs).map(([key, value]) => `<li><span>${escapeHTML(key)}</span><span>${escapeHTML(value)}</span></li>`).join('')}
        </ul>
        <div class="product-actions-group">
          <button class="btn primary-btn" id="enquireViaWhatsApp" type="button">Enquire on WhatsApp</button>
          <button class="btn secondary-btn" id="emailProductEnquiry" type="button">Email Product Enquiry</button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = buildDetailMarkup();

  document.getElementById('enquireViaWhatsApp')?.addEventListener('click', () => {
    openWhatsAppEnquiry(product.name);
  });

  document.getElementById('emailProductEnquiry')?.addEventListener('click', () => {
    sendProductEmail(product.name);
  });

  const related = (window.KARIBA_PRODUCTS || []).filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  const relatedContainer = document.getElementById('relatedProducts');

  if (relatedContainer) {
    relatedContainer.innerHTML = related.length ? related.map(productCardTemplate).join('') : '<div class="empty-state">More products in this category will appear here soon.</div>';
  }
}

function setupFormValidation() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('fullName');
    const phone = document.getElementById('phoneNumber');
    const email = document.getElementById('emailAddress');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    const successMessage = document.getElementById('formSuccess');

    if (!name.value.trim() || !phone.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
      showToast('Please fill in all fields before submitting.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showToast('Please enter a valid email address.');
      return;
    }

    const emailSubject = subject.value.trim();
    const emailBody =
      `Full Name: ${name.value.trim()}\nPhone Number: ${phone.value.trim()}\nEmail: ${email.value.trim()}\n\nSubject: ${subject.value.trim()}\n\nMessage:\n${message.value.trim()}`

    window.location.href = gmailComposeUrl(emailSubject, emailBody);
    successMessage?.classList.add('visible');
    form.reset();
  });
}

function setupContactPage() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.classList.add('ready');
  }
}

function productCardTemplate(product) {
  return `
    <article class="product-card" aria-label="${escapeHTML(product.name)}">
      <div class="product-image-wrap">
        <img src="${safeImageUrl(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" referrerpolicy="no-referrer">
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span>${escapeHTML(product.category)}</span>
          <span class="stars">${renderStars(product.rating)}</span>
        </div>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="product-actions">
          <button class="btn primary-btn enquire-whatsapp" type="button" data-product-name="${escapeHTML(product.name)}">WhatsApp Enquiry</button>
          <a href="${productEmailUrl(product.name)}" class="btn secondary-btn" target="_blank" rel="noopener noreferrer">Gmail Enquiry</a>
        </div>
        <a href="product.html?id=${encodeURIComponent(String(product.id))}" class="product-detail-link">View product details</a>
      </div>
    </article>
  `;
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

document.addEventListener('DOMContentLoaded', () => {
  initPage();

  document.body.addEventListener('click', (event) => {
    const whatsappButton = event.target.closest('.enquire-whatsapp');
    if (whatsappButton) {
      const productName = whatsappButton.dataset.productName;
      openWhatsAppEnquiry(productName, 'I would like to enquire about this product.');
    }
  });
});
