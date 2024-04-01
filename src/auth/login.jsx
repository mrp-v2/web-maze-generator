import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attempt_auth } from '../modules/auth';
import Header from '../header';
import './login.css';

export default function Login({ login_callback }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [lastError, setLastError] = useState(null);

    const navigate = useNavigate();

    const login = async () => {
        if (await attempt_auth('login', username, password)) {
            login_callback(username);
            navigate('/');
        } else {
            setLastError('Invalid username or password.');
        }
    };

    const create_account = async () => {
        if (username.length === 0) { 
            setLastError('Username cannot be blank.');
            return;
        }
        if (password.length === 0) { 
            setLastError('Password cannot be blank.');
            return;
        }
        if (await attempt_auth('create', username, password)) { 
            login_callback(username);
            navigate('/');
        } else {
            setLastError('Failed to create account.')
        }
    };

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    };

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    };

    return (
        <>
            <Header show_auth_state={false} username={null} show_saved_mazes_button={false}/>
            <main id='login'>
                <div>
                    <div>
                        <label htmlFor='username'>Username:</label>
                        <input id='username' type='text' placeholder='username' value={username} onChange={usernameChanged}></input>
                    </div>
                    <div>
                        <label htmlFor='password'>Password:</label>
                        <input id='password' type='password' placeholder='password' value={password} onChange={passwordChanged}></input>
                    </div>
                    <div>
                        <div className='button'><button type='button' id='login' onClick={login}>Login</button></div>
                    </div>
                    <div>
                        <div className='button'><button type='button' id='create_account' onClick={create_account}>Create Account</button></div>
                    </div>
                    {
                        lastError === null ? <></> : 
                        <div id='error'>
                            {lastError}
                        </div>
                    }
                </div>
            </main>
        </>
    );
}