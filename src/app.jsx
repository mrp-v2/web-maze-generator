import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Main from './maze/main';
import { SavedMazes } from './maze/saved-mazes';
import { Login } from './auth/login';
import { CreateAccount } from './auth/create-account';
import './universal-styles.css';
import Header from './header';
import Footer from './footer';

export default function App(){
    const [username, setUsername] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    return (
        <BrowserRouter>
            <div className='body'>
                <Header show_saved_mazes_button={true} username={authToken ? username : ''} authorized={authToken !== null}/>
                <Routes>
                    <Route path='/' element={<Main authToken={authToken}/>} exact />
                    <Route path='/saved-mazes' element={<SavedMazes />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/create-account' element={<CreateAccount />} />
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