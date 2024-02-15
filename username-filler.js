let label = document.querySelector("#username-italics");
stored_username = sessionStorage.getItem("username");
if (stored_username === null){
    label.textContent = "";
} else {
    label.textContent = stored_username;
}