import { products } from '../data/products.js';
import { addToCart } from "../data/cart.js";
import { js_cart_quantity } from "../scripts/share/header.js";
import {cart, removeFromCart, updateCartQuantityMinus, updateCartQuantityPlus, total_cart_product
  ,reloadCart, updateCartQuantityNumber} from "../data/cart.js";

// Lấy chuỗi truy vấn từ URL
const queryString = window.location.search;

// Tạo một đối tượng URLSearchParams từ chuỗi truy vấn
const urlParams = new URLSearchParams(queryString);

// Lấy giá trị của tham số 'id'
const productId = urlParams.get('id');

let matChingProduct;

products.forEach((product) => {
  if(product.id === productId){
    matChingProduct = product;
  }
});

let productHTML = `
  <div class="left_product">
    <div class="div_img_product">
      <img class="img_product" src="${matChingProduct.image}">
    </div>
  </div>
    
  <div class="right_product">
    <div class="product_name">${matChingProduct.name}</div>
    <div class="product_price">Giá: ${matChingProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
    <div onclick="document.getElementById('chi-tiet').scrollIntoView({ behavior: 'smooth' });" class="product_description">Thông tin sản phẩm</div>

    <div class="div_quantity">
      <div class="quantity_name">Số lượng: </div>
      <div class="quantity_control">
        <button class="minus_button js_minus_button" data-product-id="${matChingProduct.id}">-</button>
        <input class="quantity js_quantity js_quantity-${matChingProduct.id}" value="1" data-product-id="${matChingProduct.id}"></input>
        <button class="plus_button js_plus_button" data-product-id="${matChingProduct.id}">+</button>
      </div> 
    </div>
    
    <button class="bt_add_to_cart js_bt_add_to_cart" data-product-id="${matChingProduct.id}">Thêm vào giỏ hàng</button>
  </div>
`;
document.querySelector('.js_product').innerHTML = productHTML;

document.querySelectorAll('.js_bt_add_to_cart').forEach((button) => {
  button.addEventListener('click', () =>{
    const productId = button.dataset.productId;
    const quantity = document.querySelector(`.js_quantity`).value;
    const quantityInt = parseInt(quantity);

    let matchingItem;

    cart.forEach((cartItem) => {
      if (cartItem.id === productId) {
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem) {
      if (matchingItem.quantity < 100) {
        matchingItem.quantity += quantityInt;
      }
    } else {
      cart.push({
        id: productId,
        quantity: quantityInt
      });
    }
    saveToStorage();

    js_cart_quantity();
  });
});



document.querySelectorAll('.js_quantity').forEach((input) => {
  input.addEventListener('input', () => {

    let value = document.querySelector(`.js_quantity`).value;
    if (!isNaN(value) && value > 0 && value < 10){
      document.querySelector(`.js_quantity`).value = value;
    }else if(value > 10){
      document.querySelector(`.js_quantity`).value = 10;
    }else {
      document.querySelector(`.js_quantity`).value = 1;
    }

  });
});

document.querySelectorAll('.js_minus_button').forEach((button) => {
  button.addEventListener('click', () => {

    let quantity = document.querySelector(`.js_quantity`).value;
    if(quantity > 1){
      quantity--;
      document.querySelector(`.js_quantity`).value = quantity;
    }

  });
});
    
document.querySelectorAll('.js_plus_button').forEach((button) => {
  button.addEventListener('click', () => {
    
    let quantity = document.querySelector(`.js_quantity`).value;
    if(quantity < 10){
      quantity++;
      document.querySelector(`.js_quantity`).value = quantity;
    }

  });
});

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

let decriptionHtml = `
  <div class="product_detail_title">Chi tiết sản phẩm</div>
    <div class="product_detail_content">
      ${matChingProduct.decription}
    </div>
`;

document.querySelector('.js_product_detail').innerHTML = decriptionHtml;


const searchResults = [];// Mảng để lưu trữ các kết quả tìm kiếm gần giống

products.forEach(product => {
  if (product && product.name && matChingProduct && matChingProduct.name) {
    if (isCloseMatch(matChingProduct.name, product.name)) {
      searchResults.push({
        product: product,
        distance: levenshteinDistance(
          removeVietnameseTones(matChingProduct.name.toLowerCase()),
          removeVietnameseTones(product.name.toLowerCase())
        )
      });
    }
  } else {
    console.error("Sản phẩm không có thuộc tính 'name' hoặc 'matChingProduct' chưa được gán:", product);
  }
});

// Sắp xếp các kết quả tìm kiếm dựa trên tên sản phẩm
searchResults.sort((a, b) => {
  const nameA = removeVietnameseTones(a.product.name.toLowerCase());
  const nameB = removeVietnameseTones(b.product.name.toLowerCase());
  const searchTermLower = removeVietnameseTones(matChingProduct.name.toLowerCase());

  const includesA = nameA.includes(searchTermLower);
  const includesB = nameB.includes(searchTermLower);

  if (includesA && !includesB) return -1;
  if (!includesA && includesB) return 1;

  // Nếu mức độ chứa tương đương, sắp xếp theo khoảng cách Levenshtein
  return a.distance - b.distance;
});

let related_productsHTML = ``;
let displayedCount = 0;
const originalProductId = matChingProduct.id; // Lấy ID của sản phẩm gốc

searchResults.forEach(result => {
  if (result.product.id !== originalProductId && displayedCount < 4) {
    related_productsHTML += `
      <div class="product_related js_product_related" data-product-id="${result.product.id}">
        <div class="image_product">
          <img class="image" src="${result.product.image}">
        </div>
        <div class="name_product">
          ${result.product.name}
        </div>
        <div class="price_product">
          ${result.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
        <div class="button_product">
          <button class="button_addToCart js_button_addToCart" data-product-id="${result.product.id}">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
    displayedCount++;
  }
});

document.querySelector('.js_related_products_list').innerHTML = related_productsHTML;

document.querySelectorAll('.js_product_related').forEach((product) => {
  product.addEventListener('click', (event) => {
    // Kiểm tra xem phần tử được nhấp có phải là nút "Thêm vào giỏ hàng" hay không
    if (!event.target.classList.contains('js_button_addToCart')) {
      const productId = product.dataset.productId;
      const productUrl = `product.html?id=${productId}`;
      window.location.href = productUrl;
    }
  });
});

document.querySelectorAll('.js_button_addToCart').forEach((button) => {
  button.addEventListener('click', () =>{
    const productId = button.dataset.productId;

    addToCart(productId);
    js_cart_quantity();
  });
});


function isCloseMatch(text1, text2, minMatchLength = 2, minSimilarityRatio = 0.0001) {
  const normalizedText1 = removeVietnameseTones(text1.toLowerCase());
  const normalizedText2 = removeVietnameseTones(text2.toLowerCase());

  // Kiểm tra xem normalizedText1 có chứa trong normalizedText2 không
  if (normalizedText2.includes(normalizedText1)) {
    return true;
  }

  // Nếu không chứa hoàn toàn, vẫn kiểm tra độ tương đồng dựa trên khoảng cách Levenshtein
  const distance = levenshteinDistance(normalizedText1, normalizedText2);
  const maxLength = Math.max(normalizedText1.length, normalizedText2.length);
  const matchLength = maxLength - distance;
  const similarityRatio = matchLength / maxLength;

  return matchLength >= minMatchLength && similarityRatio >= minSimilarityRatio;
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = (a[j - 1] === b[i - 1]) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[b.length][a.length];
}


function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Một vài trường hợp đặc biệt
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền, sắc, hỏi, ngã, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, ă, ư
  return str;
}


let width = window.innerWidth;
console.log("Chiều rộng của cửa sổ (bao gồm scrollbar):", width);

js_cart_quantity();