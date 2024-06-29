import express from "express";
import * as path from 'path';
import { engine } from 'express-handlebars';
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use("/images", express.static(path.join(__dirname, "/public/images")));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/resume', (req, res) => {
    res.render('resume');
});

app.get('/project', (req, res) => {
    res.render('project');
});

app.get('/certificate', (req, res) => {
    res.render('certificate');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));