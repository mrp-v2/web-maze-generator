async function create_account() {
    const username = document.querySelector("#username").value;
    if (username === "") {
        return;
    }
    const password = document.querySelector("#password").value;
    if (password === "") {
        return;
    }
    const response = await fetch('/api/auth/create', {
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
        window.location.href = "saved.html";
    }
}