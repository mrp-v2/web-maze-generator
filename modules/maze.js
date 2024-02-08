const blocked_color = "#404040";
const empty_color = "#e0e0e0";

export class Maze {
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;
    /** @type {number} */
    #size;
    /** @type {number} */
    #fullwidth;
    /** @type {number} */
    #fullheight;
    /** @type {number} */
    #fullsize;
    /**
     * true for empty, false for blocked
     *  @type {Array<boolean>} */
    #data;
    /** @type {Array<number>} */
    #cells_in_maze;

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height){
        this.#width = width;
        this.#height = height;
        this.#size = this.#width * this.#height;
        this.#fullwidth = this.#width * 2 + 1;
        this.#fullheight = this.#height * 2 + 1;
        this.#fullsize = this.#fullwidth * this.#fullheight;
        this.#data = Array();
        this.#cells_in_maze = Array();
        this.#generate_maze();
    }

    /**
     * 
     * @param {number} cell 
     * @returns {boolean}
     */
    #is_cell_in_maze(cell){
        return this.#cells_in_maze.includes(cell);
    }

    /**
     * 
     * @param {number} cell 
     */
    #put_cell_in_maze(cell){
        this.#cells_in_maze.push(cell);
    }

    /**
     * 
     * @param {number} a 
     * @param {number} b 
     */
    #make_path(a, b){
        this.#data[(a + b) / 2] = true;
    }

    /**
     * @returns {number}
     */
    #get_cell_not_in_maze(){
        for (let i = this.#fullwidth + 1; i < this.#fullsize - this.#fullwidth; i += 2) {
            if (i % this.#fullwidth == 0){
                i += this.#fullwidth + 1;
                if (i >= this.#fullsize - this.#fullwidth) {
                    break;
                }
            }
            if (!this.#cells_in_maze.includes(i)){
                return i;
            }
        }
        return -1;
    }

    /**
     * 
     * @param {number} cell 
     * 
     * @returns {number}
     */
    #get_random_neighbor_cell(cell){
        /** @type {Array<number>} */
        const possibilites = Array();
        if (cell % this.#fullwidth > 1 ){
            possibilites.push(cell - 2);
        }
        if (cell % this.#fullwidth < this.#fullwidth - 2){
            possibilites.push(cell + 2);
        }
        if (cell > this.#fullwidth * 3){
            possibilites.push(cell - this.#fullwidth * 2);
        }
        if (cell < this.#fullsize - this.#fullwidth * 3){
            possibilites.push(cell + this.#fullwidth * 2);
        }
        return possibilites[Math.floor(Math.random() * possibilites.length)];
    }

    #generate_maze() {
        for (let i = 0; i < this.#fullsize; i++) {
            this.#data[i] = false;
        }
        for (let i = this.#fullwidth + 1; i < this.#fullsize - this.#fullwidth; i += 2) {
            if (i % (this.#fullwidth * 2) === 0) {
                i += this.#fullwidth
                if (i >= this.#fullsize - this.#fullwidth) {
                    break;
                }
            }
            if (i % this.#fullwidth === 0) {
                i += 1;
            }
            this.#data[i] = true;
        }
        /** @type {Array<number>} */
        this.#put_cell_in_maze(this.#get_cell_not_in_maze());
        let cell_not_in_maze = this.#get_cell_not_in_maze();
        while (cell_not_in_maze !== -1) {
            /** @type {Array<number>} */
            const path = Array();
            path.push(cell_not_in_maze);
            while (!this.#is_cell_in_maze(path[path.length - 1])){
                let next = this.#get_random_neighbor_cell(path[path.length - 1]);
                if (path.includes(next)){
                    path.length = path.indexOf(next) + 1;
                } else {
                    path.push(next);
                }
            }
            for (let index = 0; index < path.length - 1; index++){
                this.#make_path(path[index], path[index + 1])
                this.#put_cell_in_maze(path[index]);
            }
            cell_not_in_maze = this.#get_cell_not_in_maze();
        }
    }

    /**
     * 
     * @param {SVGElement} svg
     */
    draw_maze(svg) {
        /** @type {Array<Node>} */
        const nodes = Array()
        svg.setAttribute("viewBox", `0 0 ${this.#fullwidth} ${this.#fullheight}`)
        for (let i = 0; i < this.#fullsize; i++){
            let x = i % this.#fullwidth;
            let y = Math.floor(i / this.#fullwidth);
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 1);
            rect.setAttribute("height", 1);
            rect.setAttribute("fill", this.#data[i] ? empty_color : blocked_color);
            nodes.push(rect);
        }
        svg.replaceChildren(...nodes);
    }

    /**
     * 0 for empty, 1 for blocked
     */
    to_string() {
        let str = `${this.#width},${this.#height},`;
        for (let i = 0; i < this.#fullsize; i++){
            if (this.#data[i]){
                str += '0';
            } else {
                str += '1';
            }
        }
        return str;
    }

    /**
     * 
     * @param {string} str 
     */
    static from_string(str) {
        let parts = str.split(',')
        let width = Number(parts[0]);
        let height = Number(parts[1])
        let maze_str = parts[2];
        let maze = new Maze(width, height)
        for (let i = 0; i < maze.#fullsize; i++){
            if (maze_str[i] == 0){
                maze.#data[i] = true;
            } else{
                maze.#data[i] = false;
            }
        }
    }
}