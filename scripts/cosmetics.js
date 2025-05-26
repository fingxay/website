import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { js_cart_quantity } from "../scripts/share/header.js";
let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
      <div class="product js_product" data-product-id="${product.id}">
        <div class="image_product">
          <img class="image" src="${product.image}">
        </div>
        <div class="name_product">
          ${product.name}
        </div>
        <div class="price_product">
          ${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
        <div class="button_product">
          <button class="button_addToCart js_button_addToCart" data-product-id="${product.id}">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
});

document.querySelector('.js_cosmetics_products').innerHTML = productsHTML;

document.querySelectorAll('.js_button_addToCart').forEach((button) => {
  button.addEventListener('click', () =>{
    const productId = button.dataset.productId;

    addToCart(productId);
    js_cart_quantity();
  });
});

js_cart_quantity();



document.querySelectorAll('.js_product').forEach((product) => {
  product.addEventListener('click', (event) => {
    // Kiểm tra xem phần tử được nhấp có phải là nút "Thêm vào giỏ hàng" hay không
    if (!event.target.classList.contains('js_button_addToCart')) {
      const productId = product.dataset.productId;
      const productUrl = `product.html?id=${productId}`;
      window.location.href = productUrl;
    }
  });
});