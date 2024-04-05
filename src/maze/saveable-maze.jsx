import React from 'react';
import Maze from './maze';
import './saveable-maze.css';

export default function SaveableMaze({maze, maze_id}) {

    const download = (event) => {
        const svg = event.target.parentElement.querySelector('svg');
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
        const anchor = document.createElement('a');
        anchor.setAttribute('download', 'maze');
        anchor.setAttribute('href', url);
        anchor.click();
    }

    return (
        <>
            <div className='saveable-maze'>
                <Maze maze={maze} maze_id={maze_id}/>
                <button type='button' onClick={download} disabled={maze === null}>Download</button>
            </div>
        </>
    );
}