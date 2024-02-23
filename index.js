const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/saved_mazes', (req, res) => {
    res.send(JSON.stringify(saved_mazes));
});

apiRouter.post('/save_maze', (req, res) => {
    saved_mazes.push(req.body);
    res.send(JSON.stringify(saved_mazes));
});

apiRouter.post('/delete_maze', (req, res) => {
    saved_mazes.splice(req.body.index, 1);
    res.send();
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

let saved_mazes = [];