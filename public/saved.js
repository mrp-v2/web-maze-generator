import {Maze} from './modules/maze.js';

/**
 * 
 * @param {Maze} maze 
 * @param {Number} index 
 */
function add_maze(maze, index){
    const main = document.querySelector('main');
    const maze_div = document.createElement('div');
    main.appendChild(maze_div);
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
    delete_button.addEventListener('click', async () => {
        await fetch('/api/delete_maze', {
            method: 'POST',
            headers: {'content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({ index: index })
        });
        await update_mazes();
    });
    delete_button.textContent = 'Delete';
    maze.draw_maze(svg);
}

async function update_mazes() {
    const main = document.querySelector('main');
    while (main.firstChild){
        main.removeChild(main.firstChild);
    }
    const response = await fetch(`/api/mazes/${localStorage.getItem('username')}`, {
        method: 'GET'
    });
    if (response.ok){
        const saved_mazes = await response.json();
        for (let i in saved_mazes) {
            add_maze(Maze.from_json(saved_mazes[i]), Number(i));
        }
    }
}

if (localStorage.getItem('username')){
    update_mazes();
} else {
    window.location.href = 'login.html'
}
