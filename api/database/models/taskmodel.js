const mongoose = require('mongoose');


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
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model('Task', taskschema);

module.exports = {
    Task
};