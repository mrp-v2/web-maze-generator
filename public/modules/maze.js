const blocked_color = "#404040";
const empty_color = "#e0e0e0";

const encode_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.";

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
     * @param {Number} width 
     * @param {Number} height 
     * @param {Array<boolean>} data 
     */
    constructor(width, height, data) {
        this.#width = width;
        this.#height = height;
        this.#size = this.#width * this.#height;
        this.#fullwidth = this.#width * 2 - 1;
        this.#fullheight = this.#height * 2 - 1;
        this.#fullsize = this.#fullwidth * this.#fullheight;
        this.#data = data;
        this.#cells_in_maze = Array();
    }

    static generate_maze(width, height) {
        let maze = new Maze(width, height, Array(width * height));
        maze.#generate_maze();
        return maze;
    }

    /**
     * @returns {number}
     */
    #get_cell_not_in_maze(){
        for (let i = 0; i < this.#fullsize; i += 2) {
            if (i % this.#fullwidth == 1){
                i += this.#fullwidth - 3;
                continue;
            }
            if (!this.#cells_in_maze.includes(i)) {
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
        /** @type {Array<number>} */
        for (let i = 0; i < this.#fullsize; i += 2) {
            if (i % this.#fullwidth == 1) {
                i += this.#fullwidth - 3;
                continue;
            }
            this.#data[i] = true;
        }
        this.#cells_in_maze.push(this.#get_cell_not_in_maze());
        let cell_not_in_maze = this.#get_cell_not_in_maze();
        while (cell_not_in_maze != -1) {
            /** @type {Array<number>} */
            const path = Array();
            path.push(cell_not_in_maze);
            while (!this.#cells_in_maze.includes(path[path.length - 1])){
                let next = this.#get_random_neighbor_cell(path[path.length - 1]);
                if (path.includes(next)){
                    path.length = path.indexOf(next) + 1;
                } else {
                    path.push(next);
                }
            }
            for (let index = 0; index < path.length - 1; index++){
                this.#data[(path[index] + path[index + 1]) / 2] = true;
                this.#cells_in_maze.push(path[index]);
            }
            cell_not_in_maze = this.#get_cell_not_in_maze();
        }
    }

    #draw_cell(x, y) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 1);
        rect.setAttribute("height", 1);
        rect.setAttribute("fill", empty_color);
        return rect;
    }

    /**
     * 
     * @param {SVGElement} svg
     */
    draw_maze(svg) {
        /** @type {Array<Node>} */
        const nodes = Array();
        svg.setAttribute("viewBox", `0 0 ${this.#fullwidth + 2} ${this.#fullheight + 2}`);
        const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        background.setAttribute("x", 0);
        background.setAttribute("y", 0);
        background.setAttribute("width", this.#fullwidth + 2);
        background.setAttribute("height", this.#fullheight + 2);
        background.setAttribute("fill", blocked_color);
        nodes.push(background);
        // draws constant cell grid
        for (let i = 0; i < this.#fullsize; i++) {
            if (this.#data[i]){
                const x = i % this.#fullwidth + 1;
                const y = Math.floor(i / this.#fullwidth) + 1;
                nodes.push(this.#draw_cell(x, y));
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
        const minimum_data = Array();
        for (let row = 0; row < this.#height; row++){
            for (let column = 1; column < this.#fullwidth; column += 2){
                minimum_data.push(this.#data[row * this.#fullwidth * 2 + column]);
            }
        }
        for (let column = 0; column < this.#width; column++){
            for (let row = 1; row < this.#fullheight; row += 2){
                minimum_data.push(this.#data[row * this.#fullwidth + column * 2]);
            }
        }
        const scheme = this.#calculate_encoding_scheme();
        let encoded_data = "";
        for (let start_index = 0; start_index < minimum_data.length; start_index += scheme){
            encoded_data += this.#encode_part(minimum_data.slice(start_index, start_index + scheme), scheme);
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
        for (let i = 0; i < full_size; i += 2) {
            if (i % full_width == 1) {
                i += full_width - 3;
                continue;
            }
            data[i] = true;
        }
        const minimum_data = Array();
        for (let i = maze_json.data.data.length - 1; i >= 0; i--) {
            Maze.#decode_part(maze_json.data.data[i], maze_json.data.scheme, minimum_data);
        }
        minimum_data.reverse()
        let index = 0;
        for (let row = 0; row < maze_json.height; row++){
            for (let column = 1; column < full_width; column += 2){
                data[row * full_width * 2 + column] = minimum_data[index++];
            }
        }
        for (let column = 0; column < maze_json.width; column++){
            for (let row = 1; row < full_height; row += 2){
                data[row * full_width + column * 2] = minimum_data[index++];
            }
        }
        return data;
    }

    static from_json(json) {
        return new Maze(json.width, json.height, Maze.#decode_maze(json));
    }
}