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
            /** @type {Array<string>} */
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
    update_latest_saved_mazes();
}

function update_latest_saved_mazes(){
    let saved_mazes = sessionStorage.getItem("saved_mazes");
    if (saved_mazes !== null){
        /** @type {Array<string>} */
        let mazes = JSON.parse(saved_mazes);
        let count = mazes.length;
        if (count >= 1){
            let svg = document.querySelector("#latest-saved-maze-1");
            let maze = Maze.from_string(mazes[count - 1]);
            maze.draw_maze(svg);
        }
        if (count >= 2){
            let svg = document.querySelector("#latest-saved-maze-2");
            let maze = Maze.from_string(mazes[count - 2]);
            maze.draw_maze(svg);
        }
        if (count >= 3){
            let svg = document.querySelector("#latest-saved-maze-3");
            let maze = Maze.from_string(mazes[count - 3]);
            maze.draw_maze(svg);
        }
    }
}

document.querySelector("#generate-button").addEventListener('click', generate_maze_clicked);
document.querySelector("#save-button").addEventListener('click', save_maze_clicked);