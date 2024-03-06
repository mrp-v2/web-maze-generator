import { attempt_auth } from "./modules/auth.js";

function create_account_clicked() {
    const url = new URL(window.location.href);
    url.pathname = 'create-account.html';
    window.location.href = url.href;
}

async function login_clicked() {
    const username = document.querySelector("#username").value;
    if (username == "") {
        return;
    }
    const password = document.querySelector("#password").value;
    if (password == "") {
        return;
    }
    attempt_auth('login', username, password);
}

(async () => {
    const username = localStorage.getItem('username');
    if (username){
        document.querySelector('#username').value = username;
    }
    document.querySelector('#login').addEventListener('click', login_clicked);
    document.querySelector('#create_account').addEventListener('click', create_account_clicked);
})();