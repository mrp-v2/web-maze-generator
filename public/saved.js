import {Maze} from './modules/maze.js';

/**
 * 
 * @param {PointerEvent} event 
 */
async function delete_maze_pressed(event) {
    /** @type {string} */
    const target = event.target.id;
    const index = Number(target.substring(11, target.length - 7));
    /** @type { Array } */
    const mazes = JSON.parse(localStorage.getItem('saved_mazes'))

    await fetch('/api/delete_maze', {
        method: 'POST',
        headers: {'content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify(mazes[index])
    })
    await update_mazes();
}

/**
 * 
 * @param {Maze} maze 
 * @param {string} id 
 */
function add_maze(maze, id){
    const main = document.querySelector('main');
    const maze_div = document.createElement('div');
    main.appendChild(maze_div);
    maze_div.setAttribute('id', id)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    maze_div.appendChild(svg);
    const info_div = document.createElement('div');
    maze_div.appendChild(info_div);
    const size_div = document.createElement('div');
    info_div.appendChild(size_div);
    size_div.setAttribute('class', 'text-div');
    size_div.textContent = `${maze.width()} x ${maze.height()}`;
    const button_div = document.createElement('div');
    info_div.appendChild(button_div);
    button_div.setAttribute('class', 'button-div');
    const delete_button = document.createElement('button');
    button_div.appendChild(delete_button);
    delete_button.setAttribute('type', 'button');
    delete_button.addEventListener('click', delete_maze_pressed);
    delete_button.setAttribute('id', `${id}-delete`)
    delete_button.textContent = 'Delete';
    maze.draw_maze(svg);
}

async function update_mazes() {
    const main = document.querySelector('main');
    while (main.firstChild){
        main.removeChild(main.firstChild);
    }
    /** @type {Array<string>} */
    let saved_mazes = JSON.parse(localStorage.getItem('saved_mazes'));
    const response = await fetch(`/api/mazes/${localStorage.getItem('username')}`, {
        method: 'GET'
    });
    if (response.ok){
        saved_mazes = await response.json();
        localStorage.setItem('saved_mazes', JSON.stringify(saved_mazes));
    }
    if (saved_mazes !== null){
        const mazes = saved_mazes;
        for (let i in saved_mazes){
            add_maze(Maze.from_json(mazes[i]), `saved-maze-${i}`);
        }
    }
}

if (localStorage.getItem('username')){
    update_mazes();
} else {
    window.location.href = 'login.html'
}
