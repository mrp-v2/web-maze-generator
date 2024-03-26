import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Main from './maze/main';
import { SavedMazes } from './maze/saved-mazes';
import { Login } from './auth/login';
import './universal-styles.css';
import Header from './header';
import Footer from './footer';

export default function App(){
    const [username, setUsername] = useState(null);
    return (
        <BrowserRouter>
            <div className='body'>
                <Header show_saved_mazes_button={true} username={username ? username : ''} authorized={username !== null}/>
                <Routes>
                    <Route path='/' element={<Main />} exact />
                    <Route path='/saved-mazes' element={<SavedMazes />} />
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