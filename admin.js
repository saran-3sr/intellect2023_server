
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.URL)

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
})

const admin = mongoose.model('adminUsers',schema)
module.exports = admin;