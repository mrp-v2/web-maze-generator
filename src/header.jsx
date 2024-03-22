import React from 'react';
import { NavLink } from 'react-router-dom';
import './universal-styles.css';

function SavedMazesButton({show}){
    if (show){
        return (
            <div className='button'><NavLink type='button' to='saved-mazes'>Saved Mazes</NavLink></div>
        );
    } else {
        return <></>;
    }
}

export default function Header({show_saved_mazes_button, username}){
    return (
    <header>
        <h1><NavLink to=''>Web Maze Generator</NavLink></h1>
        <div className='portrait-div'>
            <i className='header-filler' id='username-italics'>{username}</i>
            <SavedMazesButton show={show_saved_mazes_button} />
        </div>
    </header>
    );
}