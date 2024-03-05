(async () => {
    const username = localStorage.getItem('username');
    if (username){
        document.querySelector('#username').value = username;
    }
})();

async function login_clicked() {
    const username = document.querySelector("#username").value;
    if (username === "") {
        return;
    }
    const password = document.querySelector("#password").value;
    if (password === "") {
        return;
    }
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    if (response.ok){
        localStorage.setItem("username", username);
        const url = new URL(window.location.href);
        if (url.searchParams.has('post_authenticate_page')){
            window.location.href = url.searchParams.get('post_authenticate_page');
        }
    }
}