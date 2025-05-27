import { cart } from '../../data/cart.js';

const headerSearchBar = `
  <div class="left_header">
    <a href="cosmetics.html" class="logo_header"><img class="image_logo" src="../image/logo.webp"></a>
  </div>

  <div class="middle_header">
    <input class="search_bar js_search_bar" placeholder="Tìm kiếm" type="text">
    <button class="search_button js_search_button">Search</button>
  </div>

  <div class="right_header">
    <a href="account.html">
      <img class="icon_profile" src="../image/icons/businessman.svg">
    </a>
    <div>
      <a href="cart.html" title="Giỏ hàng của bạn">
        <img class="icon_cart" src="../image/icons/shopping-cart.svg" alt="Giỏ hàng">
      </a>
      <span class="cart_quantity js_cart_quantity">0</span>
    </div>
  </div>
`;

const LoginHeader =`
  <div class="left_header">
    <a href="cosmetics.html" class="logo_header"><img class="image_logo" src="../image/logo.webp"></a>
  </div>
  <div class="right_header">
    <a>
      <img class="icon_profile" src="../image/icons/businessman.svg">
    </a>
    <div>
      <a title="Giỏ hàng của bạn">
        <img class="icon_cart" src="../image/icons/shopping-cart.svg" alt="Giỏ hàng">
      </a>
      <span class="cart_quantity js_cart_quantity">0</span>
    </div>
  </div>
`;

if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
  document.querySelector('.cosmetics_header').innerHTML = LoginHeader;
} else {
  document.querySelector('.cosmetics_header').innerHTML = headerSearchBar;
}


export function js_cart_quantity() {
  let quantity = 0;
  cart.forEach(() => {
    quantity++;
  });
  document.querySelector('.js_cart_quantity').innerHTML = `${quantity}`;
}

const seaconSearchButton = document.querySelector('.js_seacon_search_button');
const seaconSearchInput = document.querySelector('.js_seacon_search_bar');

seaconSearchButton.addEventListener('click', () => {
  const searchTerm = seaconSearchInput.value.trim();
  localStorage.setItem('searchTerm', searchTerm);
  const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
});

seaconSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = seaconSearchInput.value.trim();
    localStorage.setItem('searchTerm', searchTerm);
    const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  }
});


const searchButtonInSearch = document.querySelector('.js_search_button');
const searchInputInSearch = document.querySelector('.js_search_bar');

searchButtonInSearch.addEventListener('click', () => {
  const searchTerm = searchInputInSearch.value.trim();
  localStorage.setItem('searchTerm', searchTerm);
  const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
});

searchInputInSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = searchInputInSearch.value.trim();
    localStorage.setItem('searchTerm', searchTerm);
    const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  }
});
