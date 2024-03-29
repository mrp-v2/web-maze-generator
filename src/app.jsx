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

    return (
        <BrowserRouter>
            <div className='body'>
                <Routes>
                    <Route path='/' element={<Main username={username} />} exact />
                    <Route path='/saved-mazes' element={<SavedMazes username={username} />} />
                    <Route path='/login' element={<Login login_callback={setUsername} />} />
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