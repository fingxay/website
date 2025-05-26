export let account = JSON.parse(localStorage.getItem('account')) || [
  { 
      username: "admin",
      password: "admin",
      email: "admin@gmail.com",
      phone: "0909090909",
      role: "admin"
  }
];

export let login = JSON.parse(localStorage.getItem('login')) || {
  status: false,
  username: "",
  role: ""
};

export let address = JSON.parse(localStorage.getItem('address')) || [
  {
    address: "123 Nguyễn Văn A, Hà Nội",
    status: "default"
  }
];
function saveToStorage(){
  localStorage.setItem('account', JSON.stringify(account));
  localStorage.setItem('login', JSON.stringify(login));
  localStorage.setItem('address', JSON.stringify(address));
}

saveToStorage();
