const express = require('express');
const connectDB = require('./db/db');
const router = require('./routes/routes');
const app = express();
const cors = require('cors');
require('dotenv').config();

connectDB();
app.use(cors());
app.use(express.json())


app.use('/api', router)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "somethingwent wrong." })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}.`);
})