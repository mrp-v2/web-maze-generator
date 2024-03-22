import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Main } from './maze/main'
import { SavedMazes } from './maze/saved-mazes';
import { Login } from './auth/login';
import { CreateAccount } from './auth/create-account';
import './universal-styles.css';
import Header from './header';

export default function App(){
    return (
    <BrowserRouter>
        <div className='body'>
            <Header show_saved_mazes_button={true} username={''}/>
            <Routes>
                <Route path='/' element={<Main />} exact />
                <Route path='/saved-mazes' element={<SavedMazes />} />
                <Route path='/login' element={<Login />} />
                <Route path='/create-account' element={<CreateAccount />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </div>
    </BrowserRouter>
    );
}

function NotFound(){
    return <main>404: Return to sender. Address unknown.</main>;
}