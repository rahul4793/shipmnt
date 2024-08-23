
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    console.log('Mongo URL:', process.env.MONGO_URI); 
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('DB connected successfully'))
    .catch((error) => console.error('DB connection failed:', error));
};

module.exports = dbConnect;
