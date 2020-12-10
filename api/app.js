const express = require('express');
var cors = require('cors');
const app = express();
const { mongoose } = require('./database/mongoose');

const parser = require('body-parser');

const { list, Task } = require('./database/models');

const port = 3000
app.set('port', port);

app.use(parser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

app.get('/lists', (req, res) => {
    list.find({}).then((lists) => { res.send(lists) });
});

app.post('/lists', (req, res) => {
    let title = req.body.title;
    let newlist = new list({
        title
    });
    newlist.save().then((listDoc) => {
        res.send(listDoc);
    });
});

app.patch('/lists/:id', (req, res) => {
    list.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ message: 'updated successfully' });
    });
});

app.delete('/lists/:id', (req, res) => {
    list.findOneAndRemove({ _id: req.params.id }).then((removedlistDoc) => {
        res.send(removedlistDoc);
    });
});

app.get('/lists/:listid/tasks', (req, res) => {
    Task.find({ _listid: req.params.listid }).then((tasks) =>
        res.send(tasks));
});

app.post('/lists/:listid/tasks', (req, res) => {
    let newtask = new Task({
        title: req.body.title,
        _listid: req.params.listid
    });
    newtask.save().then((newtaskdoc) => {
        res.send(newtaskdoc);
    });
});

app.patch('/lists/:listid/tasks/:taskid', (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.taskid, _listid: req.params.listid }, {
        $set: req.body
    }).then(() => {
        res.send({ message: 'updated successfully' });
    });
});

app.delete('/lists/:listid/tasks/:taskid', (req, res) => {
    Task.findOneAndRemove({ _id: req.params.taskid, _listid: req.params.listid }).then((removedtaskDoc) => {
        res.send(removedtaskDoc);
    });
});

app.get('/lists/:listid/tasks/:taskid', (req, res) => {
    Task.findOne({
        _id: req.params.taskid,
        _listid: req.params.listid
    }).then((tasks) => {
        res.send(tasks);
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

