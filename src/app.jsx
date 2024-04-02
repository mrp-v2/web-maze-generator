import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Main from './main/main';
import SavedMazes from './saved/saved';
import Login from './auth/login';
import Footer from './footer';
import './universal-styles.css';
import Header from './header';

export default function App(){
    const [username, setUsername] = useState(null);
    const [currentMaze, setCurrentMaze] = useState(null);

    return (
        <BrowserRouter>
            <div className='body'>
                <Routes>
                    <Route path='/' element={<Main username={username} currentMaze={currentMaze} setCurrentMaze={setCurrentMaze} />} exact />
                    <Route path='/saved' element={<SavedMazes username={username} />} />
                    <Route path='/login' element={<Login login_callback={setUsername} />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

function NotFound(){
    return (
        <>
            <Header show_auth_state={false} show_saved_mazes_button={false}/>
            <main>
                404: Return to sender. Address unknown.
            </main>
        </>
    );
}