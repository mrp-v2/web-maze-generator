async function saved_mazes_clicked() {
    const username = localStorage.getItem('username');
    if (username != null) {
        const response = await fetch(`/api/auth/user/${username}`, {
            method: 'GET'
        });
        if (response.ok) {
            const body = await response.json();
            if (body.authenticated) {
                window.location.href = 'saved.html';
                return;
            }
        }
    }
    window.location.href = 'login.html';
}