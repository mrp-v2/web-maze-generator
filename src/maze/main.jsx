import React from 'react';
import ReactDOM from 'react-dom/client';
import Maze from './maze'
import { Maze as MazeObj } from '../modules/maze';

export function Main() {
    return (
        <main>
            <Maze maze={MazeObj.generate_maze(10, 5)}/>
        </main>
    );
}