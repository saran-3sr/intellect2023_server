
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
        type: String,
        required: true,
    },
    dept: {
        type: String,
        required: true,
    },
    events:{
        type: [String],
        required: true,
    },
    year:{
        type: Number,
        required: true,
    },
    mobileNo:{
        type: Number,
        required: true,
    }
})

const db = mongoose.model('participants',schema)
module.exports = db;