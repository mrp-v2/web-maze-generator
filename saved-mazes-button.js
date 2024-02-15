function saved_mazes_clicked() {
    if (sessionStorage.getItem('username') === null || sessionStorage.getItem('password') === null) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'saved.html';
    }
}