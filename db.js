
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.URL)

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    userName: {
        type: String,
        required: true,
    },
    regNo: {
        type: Number,
        required: true,
    },
    dept: {
        type: String,
        required: true,
    },
    events:{
        type: [String],
        required: true,
    }
})

const db = mongoose.model('participants',schema)
module.exports = db;