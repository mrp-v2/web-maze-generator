import React, { useEffect, useState } from 'react';
import Maze from './maze'
import Header from '../header';
import { Maze as MazeClass } from '../modules/maze';
import './main.css';

export default function Main({username}) {
    const [currentMaze, setCurrentMaze] = useState(null);
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [latestMazes, setLatestMazes] = useState([]);

    useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const websocket = new WebSocket(`${protocol}://${window.location.host}/ws?type=latest-mazes`);

        websocket.onmessage = (event) => {
            const mazes = JSON.parse(event.data);
            setLatestMazes(mazes.map((json) => {
                return MazeClass.from_json(json);
            }));
        };

        return () => {
            websocket.close();
        };
    }, []);

    const widthChanged = (event) => {
        const newValue = Math.max(5, Math.min(50, Number(event.target.value)));
        setWidth(newValue);
    };

    const heightChanged = (event) => {
        const newValue = Math.max(5, Math.min(50, Number(event.target.value)));
        setHeight(newValue);
    };

    const save = () => {
        fetch('/api/save_maze', {
            method: 'POST',
            headers: {'content-type': 'application/json; charset=UTF-8'},
            body: currentMaze.to_json_string()
        });
    }    

    const generate = () => {
        setCurrentMaze(MazeClass.generate_maze(width, height));
    };

    return (
        <>
            <Header show_auth_state={true} username={username} show_saved_mazes_button={true}/>
            <main id='main'>
                <aside id='latest-saved-mazes-div'>
                    <h2>Latest Mazes Saved</h2>
                    <div id='latest-saved-mazes-mazes-div'>
                        {
                            [1, 2, 3].map((number) => {
                                return <Maze maze={latestMazes.length >= number ? latestMazes[number - 1] : null} maze_id={'latest-maze-' + number} key={number} />;
                            })
                        }
                    </div>
                </aside>
                <div id='maze-generation'>
                    <div id='maze-generation-controls'>
                        <form>
                            <div id='input-div'>
                                <div>
                                    <label htmlFor='width-input'>Width</label>
                                    <input id='width-input' type='number' value={width} min='5' max='50' onChange={widthChanged}/>
                                </div>
                                <div>
                                    <label htmlFor='height-input'>Height</label>
                                    <input id='height-input' type='number' value={height} min='5' max='50' onChange={heightChanged}/>
                                </div>
                            </div>
                            <div id='button-div'>
                                <div><button type='button' id='generate-button' onClick={generate}>Generate</button></div>
                                <div><button type='button' id='save-button' onClick={save} disabled={currentMaze === null || username === null}>Save</button></div>
                            </div>
                        </form>
                    </div>
                    <div id='generated-maze-div'>
                        <Maze maze={currentMaze} maze_id='generated-maze' />
                    </div>
                </div>
            </main>
        </>);
}