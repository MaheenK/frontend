const { strict } = require('assert');
const mongoose = require('mongoose');
const { stringify } = require('querystring');

const listschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const list = mongoose.model('list', listschema);

module.exports = {
    list
};