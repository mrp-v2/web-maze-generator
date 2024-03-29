import React, { useEffect, useState } from 'react';
import Header from '../header';
import Maze from './maze';
import { Maze as MazeClass } from '../modules/maze';
import './saved-styles.css';
import { useNavigate } from 'react-router-dom';

export default function SavedMazes({username}) {
    const [mazes, setMazes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!username){
            navigate('/');
            return;
        }    

        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const websocket = new WebSocket(`${protocol}://${window.location.host}/ws?type=saved-mazes`);

        websocket.onopen = () => {
            websocket.send(username);
        };

        websocket.onmessage = async (event) => {
            const response = await fetch(`/api/mazes/${username}`, {
                method: 'GET'
            });
            if (response.ok){
                const mazes_json = await response.json();
                setMazes(mazes_json.map((json) => MazeClass.from_json(json)));
            }
        };

        return () => {
            websocket.close();
        };
    }, []);

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