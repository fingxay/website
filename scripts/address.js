// --- Xử lý hiển thị/ẩn Modal Địa chỉ mới ---
const addAddressButton = document.querySelector('.account_address_title button');
const modalOverlay = document.querySelector('.js_modal_overlay');
const addAddressModal = document.querySelector('.js_add_address_modal');
const closeModalButton = document.querySelector('.js_close_modal');
const modalBackButton = document.querySelector('.js_modal_back_button');


// Mở modal khi click vào nút "Thêm địa chỉ mới"
if (addAddressButton) {
    addAddressButton.addEventListener('click', () => {
        modalOverlay.style.display = 'block';
        addAddressModal.style.display = 'flex';
        // Reset state của modal nếu cần
        resetAddressModal();
        loadProvincesIntoModal(); // Tải danh sách tỉnh/thành phố khi mở modal
    });
}

// Đóng modal khi click vào nút đóng (X)
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        addAddressModal.style.display = 'none';
    });
}

// Đóng modal khi click vào overlay
if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            addAddressModal.style.display = 'none';
        }
    });
}

// Đóng modal khi click vào nút "Trở Lại"
if (modalBackButton) {
    modalBackButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        addAddressModal.style.display = 'none';
    });
}

// Hàm để reset trạng thái của modal khi mở
function resetAddressModal() {
    document.getElementById('province_search_input').value = '';
    document.querySelector('.js_specific_address_input').value = '';

    // Ẩn các tab và danh sách chọn địa chỉ ban đầu
    document.querySelector('.js_address_selection_tabs').style.display = 'none';
    document.querySelector('.js_address_selection_list').style.display = 'none';
    document.querySelector('.js_address_selection_list').innerHTML = ''; // Xóa nội dung cũ

    // Đặt tab tỉnh/thành phố là active và hiển thị danh sách tỉnh
    document.querySelector('.js_tab_province').classList.add('active');
    document.querySelector('.js_tab_district').classList.remove('active');
    document.querySelector('.js_tab_ward').classList.remove('active');

    // Reset mã đã chọn
    currentSelectedProvinceCode = null;
    currentSelectedDistrictCode = null;
    currentSelectedProvinceName = '';
    currentSelectedDistrictName = '';
    currentSelectedWardName = '';
}


// --- Xử lý logic chọn địa chỉ trong Modal ---
const provinceSearchInput = document.getElementById('province_search_input');
const addressSelectionTabs = document.querySelector('.js_address_selection_tabs');
const addressSelectionList = document.querySelector('.js_address_selection_list');
const tabProvince = document.querySelector('.js_tab_province');
const tabDistrict = document.querySelector('.js_tab_district');
const tabWard = document.querySelector('.js_tab_ward');

let currentSelectedProvinceCode = null;
let currentSelectedDistrictCode = null;
let currentSelectedProvinceName = '';
let currentSelectedDistrictName = '';
let currentSelectedWardName = '';


// Hàm tải danh sách tỉnh/thành phố vào modal
async function loadProvincesIntoModal() {
    try {
        const response = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
        const data = await response.json();
        const provinces = data.data.data;

        addressSelectionList.innerHTML = ''; // Clear previous items
        if (provinces) {
            provinces.forEach(province => {
                const div = document.createElement('div');
                div.textContent = province.name;
                div.dataset.code = province.code;
                div.dataset.name = province.name;
                div.addEventListener('click', () => selectAddressItem('province', province));
                addressSelectionList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành phố:', error);
        addressSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu tỉnh/thành phố.</div>';
    }
}

// Hàm tải danh sách quận/huyện vào modal
async function loadDistrictsIntoModal(provinceCode) {
    try {
        const response = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
        const data = await response.json();
        const districts = data.data.data;

        addressSelectionList.innerHTML = '';
        if (districts) {
            districts.forEach(district => {
                const div = document.createElement('div');
                div.textContent = district.name;
                div.dataset.code = district.code;
                div.dataset.name = district.name;
                div.addEventListener('click', () => selectAddressItem('district', district));
                addressSelectionList.appendChild(div);
            });
        } else {
            addressSelectionList.innerHTML = '<div style="padding: 10px;">Không có quận/huyện cho tỉnh này.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
        addressSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu quận/huyện.</div>';
    }
}

// Hàm tải danh sách phường/xã vào modal
async function loadWardsIntoModal(districtCode) {
    try {
        const response = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
        const data = await response.json();
        const wards = data.data.data;

        addressSelectionList.innerHTML = '';
        if (wards) {
            wards.forEach(ward => {
                const div = document.createElement('div');
                div.textContent = ward.name;
                div.dataset.code = ward.code;
                div.dataset.name = ward.name;
                div.addEventListener('click', () => selectAddressItem('ward', ward));
                addressSelectionList.appendChild(div);
            });
        } else {
            addressSelectionList.innerHTML = '<div style="padding: 10px;">Không có phường/xã cho quận/huyện này.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
        addressSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu phường/xã.</div>';
    }
}

// Xử lý khi click vào ô input tìm kiếm địa chỉ để mở dropdown
if (provinceSearchInput) {
    provinceSearchInput.addEventListener('click', () => {
        addressSelectionTabs.style.display = 'flex';
        addressSelectionList.style.display = 'block';
        // Luôn hiển thị tab tỉnh/thành phố và tải dữ liệu khi mở
        tabProvince.classList.add('active');
        tabDistrict.classList.remove('active');
        tabWard.classList.remove('active');
        loadProvincesIntoModal();
    });
}

// Xử lý sự kiện click vào các tab (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)
if (addressSelectionTabs) {
    addressSelectionTabs.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('tab_button')) {
            // Remove active from all tabs
            document.querySelectorAll('.tab_button').forEach(btn => btn.classList.remove('active'));
            // Add active to clicked tab
            target.classList.add('active');

            const type = target.dataset.type;
            if (type === 'province') {
                loadProvincesIntoModal();
            } else if (type === 'district' && currentSelectedProvinceCode) {
                loadDistrictsIntoModal(currentSelectedProvinceCode);
            } else if (type === 'ward' && currentSelectedDistrictCode) {
                loadWardsIntoModal(currentSelectedDistrictCode);
            } else {
                addressSelectionList.innerHTML = `<div style="padding: 10px;">Vui lòng chọn ${type === 'district' ? 'tỉnh/thành phố' : 'quận/huyện'} trước.</div>`;
            }
        }
    });
}

// Hàm xử lý khi chọn một mục từ danh sách địa chỉ
function selectAddressItem(type, item) {
    if (type === 'province') {
        currentSelectedProvinceCode = item.code;
        currentSelectedProvinceName = item.name;
        currentSelectedDistrictCode = null;
        currentSelectedDistrictName = '';
        currentSelectedWardName = '';
        // Cập nhật input
        provinceSearchInput.value = item.name;
        // Chuyển sang tab Quận/Huyện sau khi chọn Tỉnh
        tabDistrict.click();
    } else if (type === 'district') {
        currentSelectedDistrictCode = item.code;
        currentSelectedDistrictName = item.name;
        currentSelectedWardName = '';
        // Cập nhật input (giữ lại tên tỉnh)
        provinceSearchInput.value = `${currentSelectedProvinceName}, ${item.name}`;
        // Chuyển sang tab Phường/Xã sau khi chọn Huyện
        tabWard.click();
    } else if (type === 'ward') {
        currentSelectedWardName = item.name;
        // Cập nhật input (giữ lại tên tỉnh, huyện)
        provinceSearchInput.value = `${currentSelectedProvinceName}, ${currentSelectedDistrictName}, ${item.name}`;
        // Đóng dropdown sau khi chọn Xã/Phường
        addressSelectionTabs.style.display = 'none';
        addressSelectionList.style.display = 'none';
    }
}

// Ẩn dropdown khi click ra ngoài (ngoại trừ click vào input và modal_content)
document.addEventListener('click', (event) => {
    const isClickInsideModalAddressSelection = provinceSearchInput.contains(event.target) ||
                                              addressSelectionTabs.contains(event.target) ||
                                              addressSelectionList.contains(event.target);

    // Kiểm tra nếu click không nằm trong các phần tử chọn địa chỉ và modal đang hiển thị
    if (!isClickInsideModalAddressSelection && addAddressModal.style.display === 'flex') {
        addressSelectionTabs.style.display = 'none';
        addressSelectionList.style.display = 'none';
    }
});


// --- Xử lý nút Hoàn thành (chỉ đóng modal) ---
const modalCompleteButton = document.querySelector('.js_modal_complete_button');

if (modalCompleteButton) {
    modalCompleteButton.addEventListener('click', () => {
        // Chỉ đóng modal, không làm gì thêm
        modalOverlay.style.display = 'none';
        addAddressModal.style.display = 'none';
    });
}



// button cập nhật
const updateUpdateModel = document.querySelector('.js_update_button');
const updateAddressModal = document.querySelector('.js_update_address_modal');
const updateButtonModel = document.querySelector('.js_modal_update_button');
const updateModalBackButton = document.querySelector('.js_modal_update_back_button');
const closeModalBt = document.querySelector('.js_update_close_modal');


// button cập nhật địa chỉ
updateUpdateModel.addEventListener('click', () => {
    modalOverlay.style.display = 'block';
    updateAddressModal.style.display = 'flex';
    // Reset state của modal nếu cần
    resetUpdateAddressModal();
    loadProvincesIntoUpdateModal(); // Tải danh sách tỉnh/thành phố khi mở modal
});

// Đóng modal khi click vào nút đóng (X)
if (closeModalBt) {
    closeModalBt.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        updateAddressModal.style.display = 'none';
    });
}

// Đóng modal khi click vào overlay
if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            updateAddressModal.style.display = 'none';
        }
    });
}

// Đóng modal khi click vào nút "Trở Lại"
if (updateModalBackButton) {
    updateModalBackButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        updateAddressModal.style.display = 'none';
    });
}

if (updateButtonModel) {
    updateButtonModel.addEventListener('click', () => {
        // Chỉ đóng modal, không làm gì thêm
        modalOverlay.style.display = 'none';
        updateAddressModal.style.display = 'none';
    });
}

// hàm reset trạng thái của modal khi mở

function resetUpdateAddressModal() {
    document.getElementById('province_update_search_input').value = '';
    document.querySelector('.js_specific_update_address_input').value = '';

    // Ẩn các tab và danh sách chọn địa chỉ ban đầu
    document.querySelector('.js_update_address_selection_tabs').style.display = 'none';
    document.querySelector('.js_update_address_selection_list').style.display = 'none';
    document.querySelector('.js_update_address_selection_list').innerHTML = ''; // Xóa nội dung cũ

    // Đặt tab tỉnh/thành phố là active và hiển thị danh sách tỉnh
    document.querySelector('.js_update_tab_province').classList.add('active');
    document.querySelector('.js_update_tab_district').classList.remove('active');
    document.querySelector('.js_update_tab_ward').classList.remove('active');

    // Reset mã đã chọn
    currentSelectedProvinceUpdateCode = null;
    currentSelectedDistrictUpdateCode = null;
    currentSelectedProvinceUpdateName = '';
    currentSelectedDistrictUpdateName = '';
    currentSelectedWardUpdateName = '';
}

// --- Xử lý logic chọn địa chỉ trong Modal ---
const provinceUpdateSearchInput = document.getElementById('province_update_search_input');
const addressUpdateSelectionTabs = document.querySelector('.js_update_address_selection_tabs');
const addressUpdateSelectionList = document.querySelector('.js_update_address_selection_list');
const tabUpdateProvince = document.querySelector('.js_update_tab_province');
const tabUpdateDistrict = document.querySelector('.js_update_tab_district');
const tabUpdateWard = document.querySelector('.js_update_tab_ward');

let currentSelectedProvinceUpdateCode = null;
let currentSelectedDistrictUpdateCode = null;
let currentSelectedProvinceUpdateName = '';
let currentSelectedDistrictUpdateName = '';
let currentSelectedWardUpdateName = '';

// Hàm tải danh sách tỉnh/thành phố vào modal
async function loadProvincesIntoUpdateModal() {
    try {
        const response = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
        const data = await response.json();
        const provinces = data.data.data;

        addressUpdateSelectionList.innerHTML = ''; // Clear previous items
        if (provinces) {
            provinces.forEach(province => {
                const div = document.createElement('div');
                div.textContent = province.name;
                div.dataset.code = province.code;
                div.dataset.name = province.name;
                div.addEventListener('click', () => selectUpdateAddressItem('province', province));
                addressUpdateSelectionList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành phố:', error);
        addressUpdateSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu tỉnh/thành phố.</div>';
    }
}

// Hàm tải danh sách quận/huyện vào modal
async function loadDistrictsIntoUpdateModal(provinceCode) {
    try {
        const response = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
        const data = await response.json();
        const districts = data.data.data;

        addressUpdateSelectionList.innerHTML = '';
        if (districts) {
            districts.forEach(district => {
                const div = document.createElement('div');
                div.textContent = district.name;
                div.dataset.code = district.code;
                div.dataset.name = district.name;
                div.addEventListener('click', () => selectUpdateAddressItem('district', district));
                addressUpdateSelectionList.appendChild(div);
            });
        } else {
            addressUpdateSelectionList.innerHTML = '<div style="padding: 10px;">Không có quận/huyện cho tỉnh này.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
        addressUpdateSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu quận/huyện.</div>';
    }
}

// Hàm tải danh sách phường/xã vào modal
async function loadWardsIntoUpdateModal(districtCode) {
    try {
        const response = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
        const data = await response.json();
        const wards = data.data.data;

        addressUpdateSelectionList.innerHTML = '';
        if (wards) {
            wards.forEach(ward => {
                const div = document.createElement('div');
                div.textContent = ward.name;
                div.dataset.code = ward.code;
                div.dataset.name = ward.name;
                div.addEventListener('click', () => selectUpdateAddressItem('ward', ward));
                addressUpdateSelectionList.appendChild(div);
            });
        } else {
            addressUpdateSelectionList.innerHTML = '<div style="padding: 10px;">Không có phường/xã cho quận/huyện này.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
        addressUpdateSelectionList.innerHTML = '<div style="padding: 10px; color: red;">Không thể tải dữ liệu phường/xã.</div>';
    }
}

// Xử lý khi click vào ô input tìm kiếm địa chỉ để mở dropdown
if (provinceUpdateSearchInput) {
    provinceUpdateSearchInput.addEventListener('click', () => {
        addressUpdateSelectionTabs.style.display = 'flex';
        addressUpdateSelectionList.style.display = 'block';
        // Luôn hiển thị tab tỉnh/thành phố và tải dữ liệu khi mở
        tabUpdateProvince.classList.add('active');
        tabUpdateDistrict.classList.remove('active');
        tabUpdateWard.classList.remove('active');
        loadProvincesIntoUpdateModal();
    });
}

// Xử lý sự kiện click vào các tab (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)
if (addressUpdateSelectionTabs) {
    addressUpdateSelectionTabs.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('tab_button')) {
            // Remove active from all tabs
            document.querySelectorAll('.tab_button').forEach(btn => btn.classList.remove('active'));
            // Add active to clicked tab
            target.classList.add('active');

            const type = target.dataset.type;
            if (type === 'province') {
                loadProvincesIntoUpdateModal();
            } else if (type === 'district' && currentSelectedProvinceUpdateCode) {
                loadDistrictsIntoUpdateModal(currentSelectedProvinceUpdateCode);
            } else if (type === 'ward' && currentSelectedDistrictUpdateCode) {
                loadWardsIntoUpdateModal(currentSelectedDistrictUpdateCode);
            } else {
                addressUpdateSelectionList.innerHTML = `<div style="padding: 10px;">Vui lòng chọn ${type === 'district' ? 'tỉnh/thành phố' : 'quận/huyện'} trước.</div>`;
            }
        }
    });
}

// Hàm xử lý khi chọn một mục từ danh sách địa chỉ
function selectUpdateAddressItem(type, item) {
    if (type === 'province') {
        currentSelectedProvinceUpdateCode = item.code;
        currentSelectedProvinceUpdateName = item.name;
        currentSelectedDistrictUpdateCode = null;
        currentSelectedDistrictUpdateName = '';
        currentSelectedWardUpdateName = '';
        // Cập nhật input
        provinceUpdateSearchInput.value = item.name;
        // Chuyển sang tab Quận/Huyện sau khi chọn Tỉnh
        tabUpdateDistrict.click();
    } else if (type === 'district') {
        currentSelectedDistrictUpdateCode = item.code;
        currentSelectedDistrictUpdateName = item.name;
        currentSelectedWardUpdateName = '';
        // Cập nhật input (giữ lại tên tỉnh)
        provinceUpdateSearchInput.value = `${currentSelectedProvinceUpdateName}, ${item.name}`;
        // Chuyển sang tab Phường/Xã sau khi chọn Huyện
        tabUpdateWard.click();
    } else if (type === 'ward') {
        currentSelectedWardUpdateName = item.name;
        // Cập nhật input (giữ lại tên tỉnh, huyện)
        provinceUpdateSearchInput.value = `${currentSelectedProvinceUpdateName}, ${currentSelectedDistrictUpdateName}, ${item.name}`;
        // Đóng dropdown sau khi chọn Xã/Phường
        addressUpdateSelectionTabs.style.display = 'none';
        addressUpdateSelectionList.style.display = 'none';
    }
}

// Ẩn dropdown khi click ra ngoài (ngoại trừ click vào input và modal_content)
document.addEventListener('click', (event) => {
    const isClickInsideModalAddressSelection = provinceUpdateSearchInput.contains(event.target) ||
                                              addressUpdateSelectionTabs.contains(event.target) ||
                                              addressUpdateSelectionList.contains(event.target);

    // Kiểm tra nếu click không nằm trong các phần tử chọn địa chỉ và modal đang hiển thị
    if (!isClickInsideModalAddressSelection && updateAddressModal.style.display === 'flex') {
        addressUpdateSelectionTabs.style.display = 'none';
        addressUpdateSelectionList.style.display = 'none';
    }
});

// --- Xử lý nút Hoàn thành (chỉ đóng modal) ---
const updateModalCompleteButton = document.querySelector('.js_update_modal_complete_button');
if (updateModalCompleteButton) {
    updateModalCompleteButton.addEventListener('click', () => {
        // Chỉ đóng modal, không làm gì thêm
        modalOverlay.style.display = 'none';
        updateAddressModal.style.display = 'none';
    });
}