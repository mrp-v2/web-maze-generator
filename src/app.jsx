import React from 'react';
import './universal-styles.css';
import Header from './header';

export default function App(){
    return (<div className='body'>
        <Header show_saved_mazes_button={true} username={''}/>
    </div>);
}