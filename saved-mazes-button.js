function saved_mazes_clicked() {
    if (localStorage.getItem('username') === null || localStorage.getItem('password') == null) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'saved.html';
    }
}