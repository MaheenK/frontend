const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TaskManager', {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => {
    console.log('connected to mongoDB');
}).catch((e) => {
    console.log('Error! Could not connect to mongoDB');
    console.log(e);
});


module.exports = {
    mongoose
};


