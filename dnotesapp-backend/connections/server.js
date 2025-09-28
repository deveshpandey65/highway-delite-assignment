const express = require('express');
const dotenv = require('dotenv');
const Routes = require('../src/routes/index')
const connectDB = require('./db');
const cors = require('cors');
connectDB();
dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://dnotesapp.vercel.app','https://dnotes-app.vercel.app/login'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());



app.use('/api/v1', Routes);

app.get('/api', (req, res) => {
    res.send('🚀 API working from Netlify!');
});

module.exports = { app };
