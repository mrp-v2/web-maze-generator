import { Maze } from './modules/maze.js';

function generate_maze_clicked() {
    /** @type {number} */
    const width = document.querySelector("#width-input").value;
    /** @type {number} */
    const height = document.querySelector("#height-input").value;
    const maze = new Maze(width, height);
    maze.draw_maze(document.querySelector("#generated-maze-canvas"));
}

function save_maze_clicked() {

}

document.querySelector("#generate-button").addEventListener('click', generate_maze_clicked);
document.querySelector("#save-button").addEventListener('click', save_maze_clicked);