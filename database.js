const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const database = client.db('mazes');
const user_collection = database.collection('user');

(async function test_connection(){
    await client.connect();
    await database.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with url ${url} because ${ex.message}`);
    process.exit(1);
});

async function get_user(username) {
    return await user_collection.findOne({ username: username });
}

async function get_user_by_token(token) {
    return await user_collection.findOne({ token: token });
}

async function create_user(username, password) {
    const hash = await bcrypt.hash(password, 10);
    const user = {
        username: username,
        password: hash,
        token: uuid.v4(),
        mazes: []
    };
    await user_collection.insertOne(user);
    return user;
}

async function save_maze(token, maze) {
    return (await get_user_by_token(token)).mazes.push(maze);
}

async function get_mazes(username) {
    return (await get_user(username)).mazes;
}

async function get_mazes_by_token(token) {
    return (await get_user_by_token(token)).mazes; 
}

async function delete_maze(token, maze) {
    /** @type { Array } */
    const mazes = (await get_user_by_token(token)).mazes;
    let remove_index = mazes.indexOf(maze);
    if (remove_index >= 0){
        mazes.splice(remove_index)
        return true;
    }
    return false;
}

module.exports = {
    get_user, get_user_by_token, create_user, save_maze, get_mazes, get_mazes_by_token, delete_maze
}