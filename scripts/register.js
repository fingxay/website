import { account } from "../data/account.js";
import { js_cart_quantity } from "../scripts/share/header.js";

const registerForm = document.getElementById('register-form');

js_cart_quantity();

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;

  if(!/[a-zA-Z]/.test(username) || username.length < 6){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Tên người dùng phải có ít nhất 6 ký tự và phải chứa chữ cái";
    errorMessage.style.display = 'block';
    return;
  }
  if(username.length > 16){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Tên người dùng không được dài hơn 16 ký tự";
    errorMessage.style.display = 'block';
    return;
  }
  if(account.some(item => item.username === username)){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Tên người dùng đã tồn tại";
    errorMessage.style.display = 'block';
    return;
  }
  if(email.includes('@gmail.com') === false){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Email không hợp lệ";
    errorMessage.style.display = 'block';
    return;
  }
  if(account.some(item => item.email === email)){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Email đã tồn tại";
    errorMessage.style.display = 'block';
    return;
  }
  if(password !== confirmPassword){
    const errorMessage = document.querySelector('.register-error');
    errorMessage.textContent = "Mật khẩu không khớp";
    errorMessage.style.display = 'block';
    return;
  }
  

  const newAccount = {
    username: username,
    email: email,
    password: password,
    phone: null,
    role: "user"
  };

  account.push(newAccount);

  localStorage.setItem('account', JSON.stringify(account));

  registerForm.style.display = 'none';

  const successMessage = document.querySelector('.register-success');
  successMessage.style.display = 'block';

  const loginButton = document.querySelector('.register-login-button');
  loginButton.style.display = 'block';

  registerForm.reset();

  return false;
});

const loginButton = document.querySelector('.register-login-button');
loginButton.addEventListener('click', () => {
  window.location.href = "login.html";
});
