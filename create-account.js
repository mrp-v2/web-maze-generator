function create_account() {
    const username = document.querySelector("#username");
    if (username.value === "") {
        return;
    }
    const password = document.querySelector("#password");
    if (password.value === "") {
        return;
    }
    localStorage.setItem("username", username.value);
    localStorage.setItem("password", password.value);
    window.location.href = "saved.html";
}