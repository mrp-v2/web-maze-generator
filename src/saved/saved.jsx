import React, { useEffect, useState } from 'react';
import Header from '../header';
import SaveableMaze from '../maze/saveable-maze';
import { Maze as MazeClass } from '../modules/maze';
import './saved.css';
import { useNavigate } from 'react-router-dom';

function SavedMaze({maze, onDelete}) {

    const make_delete_maze = () => {
        return async () => {
            await fetch('/api/delete_maze', {
                method: 'POST',
                headers: {'content-type': 'application/json; charset=UTF-8'},
                body: maze.to_json_string()
            });
            onDelete();
        };
    };

    return (
        <div>
            <SaveableMaze maze={maze}/>
            <div className='info'>
                <div className='text-div'>
                    {maze.width()} x {maze.height()}
                </div>
                <div className='button-div'>
                    <button type='button' onClick={make_delete_maze()}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SavedMazes({username}) {
    const [mazes, setMazes] = useState([]);
    const [waiting, setWaiting] = useState(false);

    const navigate = useNavigate();

    const update_mazes = async () => {
        const response = await fetch(`/api/mazes/${username}`, {
            method: 'GET'
        });
        if (response.ok){
            const json = await response.json();
            setMazes(json.map((json) => MazeClass.from_json(json)));
        }
    };

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

        websocket.onmessage = update_mazes;

        return () => {
            websocket.close();
        };
    }, []);

    return (
        <>
            <Header show_auth_state={true} username={username} show_saved_mazes_button={false}/>
            <main id='saved_mazes'>
                {mazes.map((maze) => <SavedMaze key={maze.encoded_data()} maze={maze} onDelete={update_mazes} />)}
            </main>
        </>
    );
}