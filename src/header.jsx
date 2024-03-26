import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './universal-styles.css';

function SavedMazesButton({authorized}){

    const navigate = useNavigate();

    const savedMazesPressed = () => {
        navigate('/saved-mazes');
    }

    return (
        <div className='button'><button type='button' onClick={savedMazesPressed} disabled={!authorized}>Saved Mazes</button></div>
    );
}

function UsernameOrLogin({username}){

    const navigate = useNavigate();

    const loginClicked = () => {
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

export default function Header({show_username, username}){
    return (
    <header>
        <h1><NavLink to='/'>Web Maze Generator</NavLink></h1>
        <div className='portrait-div'>
            {show_username ? <UsernameOrLogin username={username}/> : <div className='header-filler'></div>}
            <SavedMazesButton show={show_username} authorized={username !== null}/>
        </div>
    </header>
    );
}