const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const mysql = require('mysql2');
const moment = require('moment');
require('dotenv').config();
// const JOBS = require('./jobs');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

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
        const userId = 1; // Assuming user_id = 1; replace with dynamic user ID as needed
        // Fetch bedtime and attempt data
        const [bedtimeRows] = await promisePool.query("SELECT entry_date, bedtime, note FROM bedtimes WHERE user_id = ? ORDER BY entry_date DESC", [userId]);
        const [attemptRows] = await promisePool.query(`
            SELECT b.entry_date, a.attempt_time 
            FROM bedtime_attempts a 
            JOIN bedtimes b ON a.entry_id = b.entry_id 
            WHERE b.user_id = ? 
            ORDER BY b.entry_date`, [userId]);

        // Prepare formattedEntries for listing on the page
        const formattedEntries = bedtimeRows.map(row => {
            const formattedDate = moment(row.entry_date).format('MMM DD, YYYY');
            const strTime = moment(row.bedtime, 'HH:mm:ss').format('hh:mma');
            return { time: `${strTime} — ${formattedDate}`, note: row.note };
        });

        // Transform bedtime and attempt times
        const transformTimeToDecimal = (timeString) => {
            const timeParts = timeString.split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10) / 60;
            return hours < 12 ? hours + 24 + minutes : hours + minutes;
        };
        
        const transformedBedtimeRows = bedtimeRows.map(row => ({
            ...row,
            bedtime: transformTimeToDecimal(row.bedtime)
        }));
        
        const transformedAttemptRows = attemptRows.map(row => ({
            ...row,
            attempt_time: transformTimeToDecimal(row.attempt_time)
        }));
        
        // Prepare graphData for the chart
        const graphData = {
            labels: transformedBedtimeRows.map(row => moment(row.entry_date).format('YYYY-MM-DD')),
            datasets: [
              {
                label: 'Bedtime',
                data: transformedBedtimeRows.map(row => ({ x: moment(row.entry_date).format('YYYY-MM-DD'), y: row.bedtime })),
                borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 3.1,
                    pointHoverRadius: 5
                },
                {
                    label: 'Attempt time',
                    data: transformedAttemptRows.map(row => ({ x: moment(row.entry_date).format('YYYY-MM-DD'), y: row.attempt_time })),
                    borderColor: 'grey'/*'rgb(255, 99, 132)'*/,
                    backgroundColor: 'grey'/*'rgb(255, 99, 132)'*/,
                    showLine: false,
                    pointRadius: 3.1,
                    pointHoverRadius: 5
                }
            ]
        };

        // Render the page with both formattedEntries and graphData
        res.render('index', { entries: formattedEntries, graphData: JSON.stringify(graphData) });
    } catch (error) {
        console.error('Error:', error);
        res.render('index', { error: 'Error fetching data' });
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
app.post('/submit-bedtime', async (req, res) => {
    const { entry_date, bedtime, note, additionalTimes } = req.body;

    const userId = 1;// Placeholder, use actual user ID

    try {
        // Insert into bedtimes table
        const [bedtimeResult] = await promisePool.query('INSERT INTO bedtimes (user_id, entry_date, bedtime, note) VALUES (?, ?, ?, ?)', [userId, entry_date, bedtime, note]);
        const entryId = bedtimeResult.insertId;
        console.log('Insert bedtime result:', bedtimeResult);

        // Handle additionalTimes for bedtime attempts
        if (additionalTimes && additionalTimes.length > 0) {
            for (const attemptTime of additionalTimes) {
                await promisePool.query('INSERT INTO bedtime_attempts (entry_id, attempt_time) VALUES (?, ?)', [entryId, attemptTime]);
            }
            console.log('Bedtime attempts inserted successfully');
        }

        res.json({ success: true, message: 'Data and bedtime attempts submitted successfully.' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`)
})