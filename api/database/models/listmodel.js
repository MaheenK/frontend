const mongoose = require('mongoose');

const listschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _userid: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const list = mongoose.model('list', listschema);

module.exports = {
    list
};