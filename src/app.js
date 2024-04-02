const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const mysql = require('mysql2');
const moment = require('moment');
require('dotenv').config();
// const JOBS = require('./jobs');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));

// MySQL pool configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const promisePool = pool.promise();

// Configure mustache
app.set('views', `${__dirname}/pages`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress(__dirname + '/pages/partials', '.mustache'));

// Render the template
app.get('/', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            "SELECT entry_date, bedtime, note FROM bedtimes WHERE user_id = ? ORDER BY entry_date DESC",
            [1] // Assuming user_id = 1; replace with dynamic user_id as needed
        );
        const formattedEntries = rows.map(row => {
            const formattedDate = moment(row.entry_date).format('MMM DD, YYYY');
            const strTime = moment(row.bedtime, 'HH:mm:ss').format('hh:mma'); //12h clock
            //const strTime = moment(row.bedtime, 'HH:mm:ss').format('HH:mm'); //24h clock
            const note = row.note;
            //return `${strTime} — ${formattedDate} ${note}`; //This was my original attempt
            return { time: `${strTime} — ${formattedDate}`, note: note };
        });
        res.render('index', {entries: formattedEntries});
    } catch (error) {
        console.error('Error fetching bedtimes:', error);
        res.render('index', {error: 'Error fetching bedtimes'});
    }
});
app.get('/graph', (req, res) => {
    res.render('graph');
})
app.get('/stats', (req, res) => {
    res.render('stats');
})
app.get('/settings', (req, res) => {
    res.render('settings');
})
app.get('/bedtime', (req, res) => {
    const day = req.query.day;
    res.render('bedtime', { day: day });
});
app.get('/test', (req, res) => {
    res.render('test');
})
app.get('/test2', (req, res) => {
    res.render('test2');
})
// app.get('/jobs/:id', (req, res) => {
//     const id = req.params.id;
//     const matchedJob = JOBS.find(job => job.id.toString() === id);
//     res.render('job', { job: matchedJob});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`)
})