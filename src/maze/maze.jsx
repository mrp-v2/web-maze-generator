import React, { useEffect, useState } from 'react';
import './maze.css';

function pos_equals(a, b) {
    if (a === null || b === null){
        return false;
    }
    return a[0] === b[0] && a[1] === b[1];
}

function contains_pos(pos_list, pos){
    return pos_list.findIndex((item) => pos_equals(item, pos)) >= 0;
}

function transform_position(position, width){
    const x = position % width;
    const y = Math.floor(position / width);
    return [x, y];
}

/**
 * 
 * @param {Array} position 
 * @param {Array} positions 
 * @param {Array} path_stack 
 * @param {Array} choice_stack 
 */
function get_next_pos(position, positions, path_stack, choice_stack) {
    const potential_positions = [
        [position[0], position[1] + 1],
        [position[0] + 1, position[1]],
        [position[0], position[1] - 1],
        [position[0] - 1, position[1]]
    ];
    const final_positions = [];
    for (const test of potential_positions) {
        if (!contains_pos(path_stack, test) && contains_pos(positions, test)) {
            final_positions.push(test);
        }
    }
    if (final_positions.length <= choice_stack[choice_stack.length - 1]){
        path_stack.pop();
        choice_stack.pop();
    } else {
        path_stack.push(final_positions[choice_stack[choice_stack.length - 1]++]);
        choice_stack.push(0);
    }
}

function find_path(positions, a, b, path_positions) {
    const path_stack = [a];
    const choice_stack = [0];
    while (!pos_equals(path_stack[path_stack.length - 1], b)) {
        get_next_pos(path_stack[path_stack.length - 1], positions, path_stack, choice_stack)
    }
    path_stack.forEach((position) => {
        if (!pos_equals(position, a) && !pos_equals(position, b)){
            path_positions.push(position);
        }
    });
}

function Tile({position, isSelected, onClick, isPath, isSelectable}) {

    const x = position[0];
    const y = position[1];

    const pressed = () => {
        onClick(x, y);
    };

    return (
        <rect x={x + 1} y={y + 1} width='1' height='1' onClick={pressed} className={isSelected ? 'selected' : isPath ? 'path' : isSelectable ? 'selectable' : 'empty'}></rect>
    );
}

export default function Maze({ maze, maze_id }) {
    if (maze === null){
        return <svg id={maze_id}></svg>;
    }

    const [selectionA, setSelectionA] = useState(null);
    const [selectionB, setSelectionB] = useState(null);

    useEffect(() => {
        setSelectionA(null);
        setSelectionB(null);
    }, [maze]);

    const width = maze.full_width() + 2;
    const height = maze.full_height() + 2;
    const view_box = `0 0 ${width} ${height}`;

    const handleSelected = (x, y) => {
        const pos = [x, y];
        if (pos_equals(selectionA, pos)) {
            setSelectionA(null);
        }
        else if (pos_equals(selectionB, pos)) {
            setSelectionB(null);
        }
        else if (selectionA == null) {
            setSelectionA(pos);
        } 
        else if (selectionB == null) {
            setSelectionB(pos);
        }
    };

    const positions = maze.get_maze_positions();
    const path_positions = [];

    let selectable = (pos) => true;

    if (selectionA !== null && selectionB !== null) {
        find_path(positions.map((pos) => transform_position(pos, maze.full_width())), selectionA, selectionB, path_positions);
        selectable = (pos) => pos_equals(pos, selectionA) || pos_equals(pos, selectionB);
    }

    return (
        <svg id={maze_id} preserveAspectRatio='xMidYMid meet' viewBox={view_box}>
            <rect x='0' y='0' width={width} height={height} className='blocked'></rect>
            {positions.map((position) => { 
                const pos = transform_position(position, maze.full_width());
                const key = `${pos[0]},${pos[1]}`;
                const selected = pos_equals(selectionA, pos) || pos_equals(selectionB, pos);
                const isPath = contains_pos(path_positions, pos);
                const isSelectable = selectable(pos);
                return <Tile position={pos} onClick={handleSelected} isSelected={selected} isPath={isPath} selectable={isSelectable} key={key} />;
            })}
        </svg>
    );
}