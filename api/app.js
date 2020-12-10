const express = require('express');
var cors = require('cors');
const app = express();
const { mongoose } = require('./database/mongoose');
const jwt = require('jsonwebtoken');
const parser = require('body-parser');

const { list, Task, User } = require('./database/models');

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

let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found and therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}



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


//USER Routes
//post users to sign up
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})
// app.post('/users',(req,res)=>{

//     let body=req.body;
//     let newUser= User(body);

//     newUser.save().then(()=>{
//         return newUser.createSession();
//     }).then((refreshToken)=>{
//         return newUser.generateAccessAuthToken().then((accessToken)=>{
//             return {accessToken,refreshToken}
//         });

//     }).then((authTokens)=>{
//         res
//         .header('x-refresh-token', authTokens.refreshToken)
//         .header('x-access-token', authTokens.accessToken)
//         .send(newUser);
// }).catch((e) => {
//     res.status(400).send(e);
// })
// })

//post user/login
app.post('/users/login',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})
app.get('/users/me/access-token',verifySession, (req,res)=>{
req.userObject.generateAccessAuthToken().then((accessToken)=>{
    res.header('x-access-token',accessToken).send({accessToken});
}).catch((e)=>{
res.status(400).send(e);
})
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

