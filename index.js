const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));

app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/saved_mazes', (req, res) => {
    // TODO
});

apiRouter.post('/saved_maze', (req, res) => {
    // TODO
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

let saved_mazes = {};

