const blocked_color = "#404040";
const empty_color = "#e0e0e0";

const encode_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.";

export class Maze {
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;
    /** @type {number} */
    #fullwidth;
    /** @type {number} */
    #fullheight;
    /** @type {number} */
    #fullsize;
    /**
     * true for empty, false for blocked
     * rows then columns
     *  @type {Array<boolean>} */
    #data;

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Array<boolean>} data 
     */
    constructor(width, height, data) {
        this.#width = width;
        this.#height = height;
        this.#fullwidth = this.#width * 2 - 1;
        this.#fullheight = this.#height * 2 - 1;
        this.#fullsize = this.#fullwidth * this.#fullheight;
        this.#data = data;
    }

    static generate_maze(width, height) {
        let maze = new Maze(width, height, Array());
        maze.#generate_maze();
        return maze;
    }

    /**
     * @returns {number}
     */
    #get_cell_not_in_maze(cells_in_maze){
        for (let i = 0; i < this.#fullsize; i += 2) {
            if (i % this.#fullwidth == 1){
                i += this.#fullwidth - 3;
                continue;
            }
            if (!cells_in_maze.includes(i)) {
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
        if (cell >= this.#fullwidth){
            possibilites.push(cell - this.#fullwidth * 2);
        }
        if (cell < this.#fullsize - this.#fullwidth) {
            possibilites.push(cell + this.#fullwidth * 2);
        }
        return possibilites[Math.floor(Math.random() * possibilites.length)];
    }

    #generate_maze() {
        const temp_data = Array();
        /** @type {Array<number>} */
        const cells_in_maze = Array();
        cells_in_maze.push(this.#get_cell_not_in_maze(cells_in_maze));
        let cell_not_in_maze = this.#get_cell_not_in_maze(cells_in_maze);
        while (cell_not_in_maze != -1) {
            /** @type {Array<number>} */
            const path = Array();
            path.push(cell_not_in_maze);
            while (!cells_in_maze.includes(path[path.length - 1])){
                let next = this.#get_random_neighbor_cell(path[path.length - 1]);
                if (path.includes(next)){
                    path.length = path.indexOf(next) + 1;
                } else {
                    path.push(next);
                }
            }
            for (let index = 0; index < path.length - 1; index++){
                temp_data[(path[index] + path[index + 1]) / 2] = true;
                cells_in_maze.push(path[index]);
            }
            cell_not_in_maze = this.#get_cell_not_in_maze(cells_in_maze);
        }
        for (let row = 0; row < this.#height; row++){
            for (let column = 1; column < this.#fullwidth; column += 2){
                const value = temp_data[row * this.#fullwidth * 2 + column];
                this.#data.push(typeof value === 'undefined' ? false : value);
            }
        }
        for (let column = 0; column < this.#width; column++){
            for (let row = 1; row < this.#fullheight; row += 2){
                const value = temp_data[row * this.#fullwidth + column * 2];
                this.#data.push(typeof value === 'undefined' ? false : value);
            }
        }
    }

    #draw_cell_raw(x, y, width, height, fill) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", fill);
        return rect;
    }

    #draw_cell(i, width = 1, height = 1, fill = empty_color) {
        const x = i % this.#fullwidth + 1;
        const y = Math.floor(i / this.#fullwidth) + 1;
        return this.#draw_cell_raw(x, y, width, height, fill)
    }

    /**
     * 
     * @param {SVGElement} svg
     */
    draw_maze(svg) {
        /** @type {Array<Node>} */
        const nodes = Array();
        svg.setAttribute("viewBox", `0 0 ${this.#fullwidth + 2} ${this.#fullheight + 2}`);
        // draw background
        nodes.push(this.#draw_cell_raw(0, 0, this.#fullwidth + 2, this.#fullheight + 2, blocked_color));
        // draw cell grid
        for (let i = 0; i < this.#fullsize; i += 2) { 
            if (i % this.#fullwidth == 1) { 
                i += this.#fullwidth - 1;
            }
            nodes.push(this.#draw_cell(i))
        }
        // draw connections
        let index = 0;
        for (let row = 0; row < this.#height; row++){
            for (let column = 1; column < this.#fullwidth; column += 2){
                if (this.#data[index++]){
                    nodes.push(this.#draw_cell(row * this.#fullwidth * 2 + column));
                }
            }
        }
        for (let column = 0; column < this.#width; column++){
            for (let row = 1; row < this.#fullheight; row += 2){
                if (this.#data[index++]){
                    nodes.push(this.#draw_cell(row * this.#fullwidth + column * 2));
                }
            }
        }
        svg.replaceChildren(...nodes);
    }

    /**
     * 
     * @param {Array} data 
     * @param {Number} scheme 
     */
    #encode_part(data, scheme){
        let value = 0;
        for (let i = 0; i < data.length; i++) {
            value <<= 1;
            if (data[i]){
                value++;
            }
        }
        return encode_chars[value];
    }

    /**
     * 
     * @param {String} character 
     * @param {Number} scheme 
     * @param {Array<boolean>} output_data 
     */
    static #decode_part(character, scheme, output_data) {
        let value = encode_chars.indexOf(character);
        for (let i = 0; i < scheme; i++) {
            output_data.push((value & 1) == 1);
            value >>= 1;
        }
    }

    #calculate_encoding_scheme() {
        const data_size = this.#height * (this.#width - 1) + (this.#height - 1) * this.#width
        let scheme = 6;
        for (; scheme > 1; scheme--) {
            if (data_size % scheme == 0) {
                return scheme;
            }
        }
        return scheme;
    }

    #encode_maze() {
        const scheme = this.#calculate_encoding_scheme();
        let encoded_data = "";
        for (let start_index = 0; start_index < this.#data.length; start_index += scheme){
            encoded_data += this.#encode_part(this.#data.slice(start_index, start_index + scheme), scheme);
        }
        return {
            data: encoded_data,
            scheme: scheme
        };
    }

    to_json() {
        const encoded_maze = this.#encode_maze();
        return {
            width: this.#width,
            height: this.#height,
            data: encoded_maze
        };
    }

    to_json_string() {
        return JSON.stringify(this.to_json());
    }

    width(){
        return this.#width;
    }

    height(){
        return this.#height;
    }

    /**
     * 
     * @param {string} str 
     */
    static from_string(str) {
        return this.from_json(JSON.parse(str));
    }

    static #decode_maze(maze_json) {
        const full_width = maze_json.width * 2 - 1;
        const full_height = maze_json.height * 2 - 1;
        const full_size = full_width * full_height;
        const data = Array();
        for (let i = maze_json.data.data.length - 1; i >= 0; i--) {
            Maze.#decode_part(maze_json.data.data[i], maze_json.data.scheme, data);
        }
        data.reverse();
        return data;
    }

    static from_json(json) {
        return new Maze(json.width, json.height, Maze.#decode_maze(json));
    }
}