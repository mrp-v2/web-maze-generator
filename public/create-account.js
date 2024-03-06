import { attempt_auth } from "./modules/auth";

async function create_account() {
    const username = document.querySelector("#username").value;
    if (username == "") {
        return;
    }
    const password = document.querySelector("#password").value;
    if (password == "") {
        return;
    }
    attempt_auth('create', username, password);
}

(() => {
    document.querySelector('#create_account').addEventListener('click', create_account);
})();