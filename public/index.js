import { Maze } from './modules/maze.js';
import { login, is_logged_in } from './modules/auth.js';

const page_load_name = 'post_page_load_action';
const save_action_name = 'save';

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

function generate_maze_clicked() {
    /** @type {number} */
    let width = document.querySelector("#width-input").value;
    if (width < 5){
        width = 5;
    }
    else if (width > 50){
        width = 50;
    }
    /** @type {number} */
    let height = document.querySelector("#height-input").value;
    if (height < 5){
        height = 5;
    }
    else if (height > 50){
        height = 50;
    }
    const maze = Maze.generate_maze(width, height);
    maze.draw_maze(document.querySelector("#generated-maze-canvas"));
    sessionStorage.setItem("current_maze", maze.to_json_string());
}

async function save_maze() {
    let current_maze = sessionStorage.getItem("current_maze");
    if (current_maze !== null) {
        const response = await fetch('/api/save_maze', {
            method: 'POST',
            headers: {'content-type': 'application/json; charset=UTF-8'},
            body: current_maze
        });
    }
    update_latest_saved_mazes();
}

async function save_maze_clicked() {
    if (await is_logged_in()){
        await save_maze();
    } else {
        login(`index.html?${page_load_name}=${save_action_name}`);
    }
}

async function update_latest_saved_mazes(){
    const response = await fetch('/api/mazes/latest', {
        method: 'GET'
    });
    if (!response.ok){
        return;
    }
    const mazes = await response.json();
    if (mazes[0]){
        let svg = document.querySelector("#latest-saved-maze-1");
        let maze = Maze.from_json(mazes[0]);
        maze.draw_maze(svg);
    }
    if (mazes[1]){
        let svg = document.querySelector("#latest-saved-maze-2");
        let maze = Maze.from_json(mazes[1]);
        maze.draw_maze(svg);
    }
    if (mazes[2]){
        let svg = document.querySelector("#latest-saved-maze-3");
        let maze = Maze.from_json(mazes[2]);
        maze.draw_maze(svg);
    }
}

(async () => {
    document.querySelector("#generate-button").addEventListener('click', generate_maze_clicked);
    document.querySelector("#save-button").addEventListener('click', save_maze_clicked);

    let current_maze = sessionStorage.getItem('current_maze');
    if (current_maze != null) {
        const maze = Maze.from_string(current_maze);
        maze.draw_maze(document.querySelector('#generated-maze-canvas'));
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has(page_load_name)){
        switch (url.searchParams.get(page_load_name)){
            case save_action_name:
                await save_maze_clicked();
                break;
            default:
                break;
        }
        window.location.href = 'index.html';
    }

    socket.onmessage = async (event) => {
        const message = JSON.parse(await event.data);
        if (message.type === 'update_latest_mazes'){
            update_latest_saved_mazes();
        }
    };

    update_latest_saved_mazes();
})();