import React from 'react';
import './universal-styles.css';

function SavedMazesButton({show}){
    if (show){
        return (
            <div class='button'><button type='button'>Saved Mazes</button></div>
        );
    } else {
        return <></>
    }
}

export default function Header({show_saved_mazes_button, username}){
    return (
    <header>
        <h1><a href='index.html'>Web Maze Generator</a></h1>
        <div class='portrait-div'>
            <i class='header-filler' id='username-italics'>{username}</i>
            <SavedMazesButton show={show_saved_mazes_button} />
        </div>
    </header>
    );
}