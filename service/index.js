const cookie_parser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const uuid = require('uuid');
const app = express();
const database = require('./database.js');
const { WebSocketServer } = require('ws');

const auth_cookie_name = 'auth_token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

let latest_maze_connections = [];
let saved_maze_connections = [];

app.use(express.json());
app.use(cookie_parser());
app.use(express.static('public'));

const web_socket = new WebSocketServer({noServer: true});

function update_latest_mazes(connection, mazes){
    connection.socket.send(JSON.stringify(mazes));
}

web_socket.on('connection', (socket, req) => {

    const url = new URL(req.url, 'https://startup.mrp-v2.net');

    if (!url.searchParams.has('type')){
        socket.close();
        return;
    }

    let connection;

    switch (url.searchParams.get('type')){
        case 'latest-mazes':
            connection = {
                id: uuid.v4(),
                alive: true,
                socket: socket
            };
            latest_maze_connections.push(connection);
            socket.on('close', () => {
                latest_maze_connections.findIndex((o, i) => {
                    if (o.id === connection.id) {
                        latest_maze_connections.splice(i, 1);
                        return true;
                    }
                })
            });
            const mazes = database.get_latest_saved_mazes();
            update_latest_mazes(connection, mazes);
            break;
        case 'saved-mazes':
            connection = {
                id: uuid.v4(),
                alive: true,
                socket: socket,
                username: null
            };
            saved_maze_connections.push(connection);
            socket.on('close', () => {
                saved_maze_connections.findIndex((o, i) => {
                    if (o.id === connection.id) {
                        saved_maze_connections.splice(i, 1);
                        return true;
                    }
                })
            });
            socket.on('message', async (event) => {
                connection.username = event.toString();
                socket.send();
            });
            break;
    }

    socket.on('pong', () => {
        connection.alive = true;
    });
});

setInterval(() => {
    latest_maze_connections.forEach((c) => {
        if (!c.alive) {
            c.socket.terminate();
        } else {
            c.alive = false;
            c.socket.ping();
        }
    });
    saved_maze_connections.forEach((c) => {
        if (!c.alive){
            c.socket.terminate();
        } else {
            c.alive = false;
            c.socket.ping();
        }
    });
}, 10000);

const api_router = express.Router();
app.use('/api', api_router);

api_router.post('/auth/create', async (req, res) => {
    if (await database.get_user(req.body.username)){
        res.status(409).send({msg: 'User already exists'});
    } else {
        const user = await database.create_user(req.body.username, req.body.password);
        set_auth_cookie(res, user.token);
        res.send({
            id: user._id
        });
    }
});

api_router.post('/auth/login', async (req, res) => {
    const user = await database.get_user(req.body.username);
    if (user){
        if (await bcrypt.compare(req.body.password, user.password)) {
            set_auth_cookie(res, user.token);
            res.send({id: user._id});
            return;
        }
    }
    res.status(401).send({ msg: 'Invalid auth token'});
});

api_router.get('/auth/user/:username', async (req, res) => {
    const user = await database.get_user(req.params.username);
    if (user){
        const token = req.cookies[auth_cookie_name];
        res.send({ username: user.username, authenticated: token == user.token });
        return;
    }
    res.status(401).send({ msg: 'User does not exist' });
});

api_router.get('/mazes/latest', (req, res) => {
    res.send(database.get_latest_saved_mazes());
});

api_router.get('/mazes/:username', async (req, res) => {
    res.send(await database.get_mazes(req.params.username));
});

let secure_api_router = express.Router();
api_router.use(secure_api_router);

secure_api_router.use(async (req, res, next) => {
    auth_token = req.cookies[auth_cookie_name];
    const user = await database.get_user_by_token(auth_token);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

secure_api_router.post('/save_maze', async (req, res) => {
    await database.save_maze(req.cookies[auth_cookie_name], req.body);
    res.end();
    const latest_mazes = database.get_latest_saved_mazes();
    latest_maze_connections.forEach((c) => {
        update_latest_mazes(c, latest_mazes);
    });
    update_client_saved_mazes(req.cookies[auth_cookie_name]);
});

function update_client_saved_mazes(token) {
    const user = database.get_user_by_token(token);
    saved_maze_connections.forEach((c) => {
        if (c.username == user.username){
            c.socket.send();
        }
    });
}

secure_api_router.post('/delete_maze', async (req, res) => {
    res.send(await database.delete_maze(req.cookies[auth_cookie_name], req.body.index))
    update_client_saved_mazes(req.cookies[auth_cookie_name]);
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

function set_auth_cookie(res, auth_token) {
    res.cookie(auth_cookie_name, auth_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    });
}

const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

server.on('upgrade', (req, socket, head) => {
    web_socket.handleUpgrade(req, socket, head, function done(ws) {
        web_socket.emit('connection', ws, req);
    });
});