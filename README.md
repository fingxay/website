# Cool Beauty - Website Ban My Pham

Day la du an website ban my pham xay dung bang `HTML/CSS/JavaScript` thuan (khong dung framework).  
Ung dung hoat dong phia client, su dung `localStorage` de luu du lieu gio hang, tai khoan va cac trang thai lien quan.

## 1. Tong quan

- Trang vao mac dinh: `index.html` (tu dong redirect sang `html/cosmetics.html`)
- Trang chuc nang chinh:
- `html/cosmetics.html`: danh sach san pham
- `html/product.html`: chi tiet san pham + san pham lien quan
- `html/search.html`: tim kiem san pham
- `html/cart.html`: gio hang
- `html/login.html`: dang nhap
- `html/register.html`: dang ky
- `html/account.html`: thong tin tai khoan + giao dien dia chi

## 2. Tinh nang da co

- Hien thi danh sach san pham tu `data/products.js`
- Them san pham vao gio hang
- Tang/giam/sua so luong san pham trong gio
- Tinh tong tien gio hang theo `VND`
- Tim kiem san pham (co xu ly gan dung theo Levenshtein + bo dau tieng Viet)
- Xem chi tiet san pham theo query `?id=...`
- Goi y san pham lien quan trong trang chi tiet
- Dang ky tai khoan (validate username/email/password co ban)
- Dang nhap tai khoan (doi chieu du lieu trong `localStorage`)
- Header dung chung cho cac trang (logo, tim kiem, icon gio hang/tai khoan)
- Modal chon dia chi (goi API don vi hanh chinh Viet Nam)

## 3. Cong nghe va kien truc

- Frontend:
- `HTML5`
- `CSS3`
- `JavaScript ES Modules`
- Luu tru du lieu client:
- `localStorage` keys chinh:
- `cart`
- `account`
- `login`
- `address`
- Thu vien/CDN:
- Font Awesome (icon)
- API ngoai:
- `https://vn-public-apis.fpo.vn` (provinces/districts/wards trong `scripts/address.js`)

## 4. Cau truc thu muc

```text
website-main/
|-- index.html
|-- README.md
|-- html/                 # cac trang giao dien
|-- styles/               # css theo tung trang/chuc nang
|-- scripts/              # logic giao dien
|   |-- share/header.js   # header + tim kiem + hien thi so luong gio hang
|-- data/                 # du lieu va ham xu ly localStorage
|-- image/                # logo, icon, anh san pham
```

## 5. Cach chay du an

Du an la static site, co the chay theo 1 trong 2 cach:

1. Mo truc tiep file `index.html` bang trinh duyet.
2. Chay local server de tranh loi CORS/module:

```bash
# Neu da cai VS Code Live Server: mo root project va Run Live Server
# Hoac dung Python:
python -m http.server 5500
```

Sau do truy cap:

```text
http://localhost:5500/
```

## 6. Luong du lieu chinh

- Danh sach san pham duoc khai bao trong `data/products.js`.
- Gio hang duoc quan ly boi `data/cart.js`, dong bo vao `localStorage`.
- Dang ky tai khoan se push vao mang `account` va luu `localStorage`.
- Dang nhap kiem tra thong tin trong mang `account`.
- Header doc du lieu gio hang de hien thi badge so luong.

## 7. Tai khoan mac dinh

Khi chua co du lieu `account` trong `localStorage`, he thong tao tai khoan mac dinh:

- Username: `admin`
- Password: `admin`
- Email: `admin@gmail.com`
- Role: `admin`

## 8. Ghi chu han che hien tai

- Chua co backend, khong co xac thuc phia server.
- Mat khau dang luu plain text trong `localStorage` (chi phu hop hoc tap/demo).
- Trang account/address hien co giao dien va mot phan logic, chua hoan thien luu/cap nhat du lieu dia chi day du.
- Du lieu tieng Viet trong source dang gap van de encoding o mot so file (hien thi ky tu loi neu sai encoding).

## 9. Huong phat trien de xuat

- Bo sung backend (auth, san pham, don hang)
- Chuan hoa encoding UTF-8 cho toan bo source
- Toi uu phan tim kiem va lien quan san pham
- Them phan trang/loc/sap xep san pham
- Them test cho cac ham quan ly gio hang va validate form
