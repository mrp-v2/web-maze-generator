import React from 'react';
import Header from '../header';
import Maze from './maze';
import { Maze as MazeClass } from '../modules/maze';
import './saved-styles.css';

export default function SavedMazes({username, mazes}) {

    const make_delete_maze = (index) => {
        return async () => {
            await fetch('/api/delete_maze', {
                method: 'POST',
                headers: {'content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify({index: index})
            })
        };
    }

    return (
        <>
            <Header show_username={true} username={username} />
            <main>
                {mazes.map((maze, index) => {
                    return (
                        <div key={index}>
                            <Maze maze={maze}/>
                            <div>
                                <div className='text-div'>
                                    {maze.width()} x {maze.height()}
                                </div>
                                <div className='button-div'>
                                    <button type='button' onClick={make_delete_maze(index)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </>
    );
}