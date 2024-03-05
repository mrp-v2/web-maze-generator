import { Maze } from './modules/maze.js';
import { login, is_logged_in } from './modules/auth.js'

const page_load_name = 'post_page_load_action';
const save_action_name = 'save';

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
        if (response.ok) {
            localStorage.setItem("saved_mazes", JSON.stringify(await response.json()));
        } else {
            let saved_mazes = localStorage.getItem("saved_mazes");
            if (saved_mazes !== null) {
                /** @type {Array<string>} */
                let mazes = JSON.parse(saved_mazes);
                mazes.push(current_maze)
                localStorage.setItem("saved_mazes", JSON.stringify(mazes));
            } else {
                /** @type {Array<Maze>} */
                let mazes = new Array();
                mazes.push(current_maze);
                localStorage.setItem("saved_mazes", JSON.stringify(mazes));
            }
        }
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

function update_latest_saved_mazes(){
    let saved_mazes = localStorage.getItem("saved_mazes");
    if (saved_mazes !== null){
        /** @type {Array<string>} */
        let mazes = JSON.parse(saved_mazes);
        let count = mazes.length;
        if (count >= 1){
            let svg = document.querySelector("#latest-saved-maze-1");
            let maze = Maze.from_json(mazes[count - 1]);
            maze.draw_maze(svg);
        }
        if (count >= 2){
            let svg = document.querySelector("#latest-saved-maze-2");
            let maze = Maze.from_json(mazes[count - 2]);
            maze.draw_maze(svg);
        }
        if (count >= 3){
            let svg = document.querySelector("#latest-saved-maze-3");
            let maze = Maze.from_json(mazes[count - 3]);
            maze.draw_maze(svg);
        }
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

    update_latest_saved_mazes();

    fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
        /** @type { HTMLDivElement } */
        const quote_element = document.querySelector('#quote');
        quote_element.textContent = data.content;
    });
})();