import React from 'react';
import ReactDOM from 'react-dom/client';

const blocked_color = "#404040";
const empty_color = "#e0e0e0";

export default function Maze({ maze }) {
    if (maze === null){
        return <svg id='generated-maze'></svg>;
    }
    const width = `${maze.full_width() + 2}`;
    const height = `${maze.full_height() + 2}`;
    const view_box = `0 0 ${width} ${height}`;
    return (
    <svg id='generated-maze' preserveAspectRatio='xMidYMid meet' viewBox={view_box}>
        <rect x='0' y='0' width={width} height={height} fill={blocked_color}></rect>
            {maze.get_maze_positions().map((position, index) => { 
                const x = `${position % maze.full_width() + 1}`;
                const y = `${Math.floor(position / maze.full_width()) + 1}`;
                const key = `${index}`;
                return <rect x={x} y={y} width='1' height='1' fill={empty_color} key={key}></rect>;
            })}
    </svg>
    );
}