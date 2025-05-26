import { account } from "../data/account.js";
import { js_cart_quantity } from "../scripts/share/header.js";

const loginForm = document.getElementById('login-form');

js_cart_quantity();

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username_login').value;
  const password = document.getElementById('password_login').value;

  if(account.some(item => item.username === username && item.password === password)){
    window.location.href = 'cosmetics.html';
  }else{
    const errorMessage = document.querySelector('.login-error');
    errorMessage.textContent = 'Tên người dùng hoặc mật khẩu không chính xác';
    errorMessage.style.display = 'block';
  }
});