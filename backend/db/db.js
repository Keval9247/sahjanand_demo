const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("connect to db.");

    } catch (error) {
        console.log("Error while connecting the db: ", error);
    }
}

module.exports = connectDB;