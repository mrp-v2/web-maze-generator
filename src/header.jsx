import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './universal-styles.css';

function SavedMazesButton({show, authorized}){

    const navigate = useNavigate();

    function savedMazesPressed(){
        navigate('/saved-mazes');
    }

    if (show){
        return (
            <div className='button'><button type='button' onClick={savedMazesPressed} disabled={!authorized}>Saved Mazes</button></div>
        );
    } else {
        return <></>;
    }
}

function UsernameOrLogin({username}){

    const navigate = useNavigate();

    function loginClicked(){
        navigate('/login');
    }

    if (username !== null){
        return <i className='header-filler' id='username-italics'>{username}</i>;
    } else {
        return (
            <>
                <div className='header-filler'></div>
                <div className='button'><button type='button' onClick={loginClicked}>Login</button></div>
            </>
        );
    }
}

export default function Header({show_saved_mazes_button, username, authorized}){
    return (
    <header>
        <h1><NavLink to=''>Web Maze Generator</NavLink></h1>
        <div className='portrait-div'>
            <UsernameOrLogin username={authorized ? username : null}/>
            <SavedMazesButton show={show_saved_mazes_button} authorized={authorized}/>
        </div>
    </header>
    );
}