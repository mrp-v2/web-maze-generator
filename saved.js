import {Maze} from "./modules/maze.js";

/**
 * 
 * @param {PointerEvent} event 
 */
function delete_maze_pressed(event) {
    let main = document.querySelector("main");
    /** @type {string} */
    let target = event.target.id;
    let index = Number(target.substring(11, target.length - 7));
    let id = `#${target.substring(0, target.length - 7)}`
    let maze_element = document.querySelector(id);
    main.removeChild(maze_element);
    /** @type {Array<string>} */
    let saved_mazes = JSON.parse(sessionStorage.getItem("saved_mazes"));
    saved_mazes.splice(index)
    sessionStorage.setItem("saved_mazes", JSON.stringify(saved_mazes));
}

/**
 * 
 * @param {Maze} maze 
 * @param {string} id 
 */
function add_maze(maze, id){
    let main = document.querySelector("main");
    let maze_div = document.createElement("div");
    maze_div.setAttribute("id", id)
    let svg = document.createElement("svg");
    let info_div = document.createElement("div");
    let size_div = document.createElement("div");
    size_div.setAttribute("class", "text-div");
    size_div.textContent = `${maze.width()} x ${maze.height()}`;
    let button_div = document.createElement("div");
    button_div.setAttribute("class", "button-div");
    let delete_button = document.createElement("button");
    delete_button.setAttribute("type", "button");
    delete_button.addEventListener("click", delete_maze_pressed);
    delete_button.setAttribute("id", `${id}-delete`)
    delete_button.textContent = "Delete";
    button_div.appendChild(delete_button);
    info_div.appendChild(size_div);
    info_div.appendChild(button_div);
    maze_div.appendChild(svg);
    maze_div.appendChild(info_div);
    main.appendChild(maze_div);
    maze.draw_maze(svg);
}

let saved_mazes = sessionStorage.getItem("saved_mazes");
    if (saved_mazes !== null){
        /** @type {Array<string>} */
        let mazes = JSON.parse(saved_mazes);
        for (let i in mazes){
            add_maze(Maze.from_string(mazes[i]), `saved-maze-${i}`);
        }
    }
// add saved mazes