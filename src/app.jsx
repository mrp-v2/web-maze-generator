import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './maze/main';
import SavedMazes from './maze/saved-mazes';
import Login from './auth/login';
import Footer from './footer';
import { Maze as MazeClass } from './modules/maze';
import './universal-styles.css';

export default function App(){
    const [username, setUsername] = useState(null);
    const [mazes, setMazes] = useState(Array());
    const [latestMazes, setLatestMazes] = useState(Array());

    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const websocket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    const update_latest_mazes = async () => {
        const response = await fetch('/api/mazes/latest', {
            method: 'GET'
        });
        if (response.ok){
            setLatestMazes((await response.json()).map((maze) => MazeClass.from_json(maze)));
        }
    };

    websocket.onmessage = async (event) => {
        const message = JSON.parse(await event.data);
        switch (message.type){
            case 'update_latest_mazes':
                update_latest_mazes();
                break;
        }
    };

    return (
        <BrowserRouter>
            <div className='body'>
                <Routes>
                    <Route path='/' element={<Main username={username} latest_mazes={latestMazes}/>} exact />
                    <Route path='/saved-mazes' element={<SavedMazes username={username} mazes={mazes}/>} />
                    <Route path='/login' element={<Login login_callback={setUsername}/>} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

function NotFound(){
    return <main>404: Return to sender. Address unknown.</main>;
}