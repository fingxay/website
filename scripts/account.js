const accountProfife = document.querySelector(".bottom_right_account_profile");
const profileButton = document.querySelector(".profile_button");

const accountAddress = document.querySelector(".bottom_right_account_address");
const addressButton = document.querySelector(".address_button");

const accountSettings = document.querySelector(".bottom_right_account_settings");
const settingsButton = document.querySelector(".setting_button");

profileButton.addEventListener("click", () => {
  if (accountProfife.style.display === "none" || accountProfife.style.display === "") {
    accountProfife.style.display = "grid";
    const profileTitle = 'Hồ sơ';
    document.querySelector('.top_right_account').innerHTML = profileTitle;

    // Hide other sections
    accountAddress.style.display = "none";
    accountSettings.style.display = "none";
  }
});

addressButton.addEventListener("click", () => {
  if (accountAddress.style.display === "none" || accountAddress.style.display === "") {
    accountAddress.style.display = "grid";
    const addressTitle = 'Địa chỉ';
    document.querySelector('.top_right_account').innerHTML = addressTitle;

    // Hide other sections
    accountProfife.style.display = "none";
    accountSettings.style.display = "none";
  }
});

settingsButton.addEventListener("click", () => {
  if (accountSettings.style.display === "none" || accountSettings.style.display === "") {
    accountSettings.style.display = "flex";
    const settingsTitle = 'Cài đặt';
    document.querySelector('.top_right_account').innerHTML = settingsTitle;

    // Hide other sections
    accountProfife.style.display = "none";
    accountAddress.style.display = "none";
  }
});