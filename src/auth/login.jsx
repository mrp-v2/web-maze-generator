import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {

    const navigate = useNavigate();

    function login(){

    }

    function create_account(){
        navigate('/create-acount');
    }

    return (
        <main>
            <div>
                <div>
                    <label for='username'>Username:</label>
                    <input id='username' type='text' placeholder='username'></input>
                </div>
                <div>
                    <label for='password'>Password:</label>
                    <input id='password' type='password' placeholder='password'></input>
                </div>
                <div>
                    <div className='button'><button type='button' id='login' onClick={login}>Login</button></div>
                </div>
                <div>
                    <div className='button'><button type='button' id='create_account' onClick={create_account}>Create Account</button></div>
                </div>
            </div>
        </main>
    );
}