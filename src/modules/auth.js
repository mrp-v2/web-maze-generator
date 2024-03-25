export async function is_logged_in() {
    const username = localStorage.getItem('username');
    if (username == '') {
        return false;
    }
    const response = await fetch(`/api/auth/user/${username}`, {
        method: 'GET'
    });
    if (response.ok) {
        const body = await response.json();
        return body.authenticated;
    } else {
        return false;
    }
}

export async function ensure_logged_in(post_authenticate_page) {
    if (!(await is_logged_in())){
        login(post_authenticate_page);
    } else {
        window.location.href = post_authenticate_page;
    }
}

export function login(post_authenticate_page){
    window.location.href = `login.html?post_authenticate_page=${post_authenticate_page}`;
}

export async function attempt_auth(url, username, password) {
    const response = await fetch(`/api/auth/${url}`, {
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
        return true;
    }
}