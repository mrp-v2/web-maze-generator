import { Maze } from './modules/maze.js';

function generate_maze_clicked() {
    /** @type {number} */
    const width = document.querySelector("#width-input").value;
    /** @type {number} */
    const height = document.querySelector("#height-input").value;
    const maze = new Maze(width, height);
    maze.draw_maze(document.querySelector("#generated-maze-canvas"));
    sessionStorage.setItem("current_maze", maze.to_string());
}

function save_maze_clicked() {
    let current_maze = sessionStorage.getItem("current_maze");
    if (current_maze !== null) {
        let saved_mazes = sessionStorage.getItem("saved_mazes");
        if (saved_mazes !== null) {
            /** @type {Array<Maze>} */
            let mazes = JSON.parse(saved_mazes);
            mazes.push(current_maze)
            sessionStorage.setItem("saved_mazes", JSON.stringify(mazes));
        } else {
            /** @type {Array<Maze>} */
            let mazes = new Array();
            mazes.push(current_maze);
            sessionStorage.setItem("saved_mazes", JSON.stringify(mazes));
        }
    }
}

function update_latest_saved_mazes(){

}

document.querySelector("#generate-button").addEventListener('click', generate_maze_clicked);
document.querySelector("#save-button").addEventListener('click', save_maze_clicked);