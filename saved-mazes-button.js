import { ensure_logged_in } from './modules/auth.js'

async function saved_mazes_clicked() {
    await ensure_logged_in('saved.html');
}

(() => {
    document.querySelector('header button').addEventListener('click', saved_mazes_clicked);
})();