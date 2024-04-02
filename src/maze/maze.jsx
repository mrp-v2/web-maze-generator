import React, { useEffect, useState } from 'react';
import './maze.css';

function Tile({x, y, selected, onClick}) {
    if (onClick) {
        const pressed = () => {
            onClick(x, y);
        };
        return (
            <rect x={x} y={y} width='1' height='1' onClick={pressed} className={selected ? 'selected' : 'selectable'}></rect>
        );
    } else {
        return (
            <rect x={x} y={y} width='1' height='1' className='empty'></rect>
        );
    }
}

function pos_equals(a, b) {
    if (a === null || b === null){
        return false;
    }
    return a[0] === b[0] && a[1] === b[1];
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

    const width = `${maze.full_width() + 2}`;
    const height = `${maze.full_height() + 2}`;
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

    return (
        <svg id={maze_id} preserveAspectRatio='xMidYMid meet' viewBox={view_box}>
            <rect x='0' y='0' width={width} height={height} className='blocked'></rect>
            {maze.get_maze_positions().map((position) => { 
                const x = position % maze.full_width();
                const y = Math.floor(position / maze.full_width());
                const selectable = x % 2 == 0 && y % 2 == 0;
                const pos = [`${x + 1}`, `${y + 1}`];
                const selected = pos_equals(selectionA, pos) || pos_equals(selectionB, pos);
                return <Tile x={`${x + 1}`} y={`${y + 1}`} onClick={selectable ? handleSelected : null} selected={selected} key={`${x},${y}`} />;
            })}
        </svg>
    );
}