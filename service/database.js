const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const database = client.db('mazes');
const user_collection = database.collection('user');
let latest_saved_mazes = [];

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
    const user = await get_user_by_token(token);
    /** @type { Array } */
    const mazes = user.mazes;
    mazes.push(maze);
    const result = await user_collection.updateOne({token: token}, {
        $set: {
            mazes: mazes
        }
    })
    if (result && result.modifiedCount > 0){
        latest_saved_mazes = [maze, latest_saved_mazes[0], latest_saved_mazes[1]];
        return mazes;
    } else {
        return null;
    }
}

function get_latest_saved_mazes(){
    return latest_saved_mazes;
}

async function get_mazes(username) {
    const user  = await get_user(username);
    return user.mazes;
}

async function get_mazes_by_token(token) {
    return (await get_user_by_token(token)).mazes; 
}

/**
 * 
 * @param {String} token 
 * @param {Object} maze_index 
 * @returns 
 */
async function delete_maze(token, maze_index) {
    /** @type { Array } */
    const user = await get_user_by_token(token);
    /** @type { Array } */
    const mazes = user.mazes;
    if (maze_index < 0 || maze_index >= mazes.length){
        throw Error("maze index out of bounds");
    }
    mazes.splice(maze_index, 1);
    const result = await user_collection.updateOne({token: token}, {
        $set: {
            mazes: mazes
        }
    });
    if (result && result.modifiedCount > 0){
        return mazes;
    } else {
        throw Error("Error trying to remove requested maze from database.");
    }
}

module.exports = {
    get_user, get_user_by_token, create_user, save_maze, get_mazes, get_mazes_by_token, delete_maze, get_latest_saved_mazes
}