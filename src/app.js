const express = require('express');
const bookingsRouter = require('./routes/bookings');

const app = express();

app.use(express.json());
app.use('/api/bookings', bookingsRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
