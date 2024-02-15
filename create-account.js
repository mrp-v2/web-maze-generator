function create_account() {
    const username = document.querySelector("#username");
    if (username.value === "") {
        return;
    }
    const password = document.querySelector("#password");
    if (password.value === "") {
        return;
    }
    sessionStorage.setItem("username", username.value);
    sessionStorage.setItem("password", password.value);
    window.location.href = "saved.html";
}