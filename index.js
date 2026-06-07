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
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));

const siteUrl = process.env.SITE_URL || 'https://mtahir.me';
const defaultDescription =
    'Software Engineer & AI/ML Researcher — MSCS @ Universiti Malaya. Agentic AI, healthcare research, and production full-stack apps. Open to remote worldwide.';

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Muhammad Tahir | Software Engineer & AI/ML Researcher',
        description: defaultDescription,
        path: '/',
        siteUrl,
    });
});

app.get('/resume', (req, res) => {
    res.render('resume', {
        title: 'Resume | Muhammad Tahir',
        description: 'Software Engineer & AI/ML Researcher with MSCS research at Universiti Malaya and production aviation platforms.',
        path: '/resume',
        siteUrl,
    });
});

app.get('/project', (req, res) => {
    res.render('project', {
        title: 'Projects | Muhammad Tahir',
        description: 'Production aviation platforms, Google Play mobile app, and academic full-stack projects.',
        path: '/project',
        siteUrl,
    });
});

app.get('/certificate', (req, res) => {
    res.render('certificate', {
        title: 'Certifications | Muhammad Tahir',
        description: 'Professional certifications in cloud, data science, AI, and project management.',
        path: '/certificate',
        siteUrl,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Portfolio listening on port ${port}`));