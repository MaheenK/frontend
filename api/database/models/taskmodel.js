const { strict } = require('assert');
const mongoose = require('mongoose');
const { stringify } = require('querystring');

const taskschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _listid: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
});

const Task = mongoose.model('Task', taskschema);

module.exports = {
    Task
};