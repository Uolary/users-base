const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();

const userScheme = new Schema({
    name: {
        type: String,
        default: 'No name'
    },
    age: Number
}, {versionKey: false});

const User = mongoose.model('User', userScheme);

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/usersdb', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) return console.log(err);

    app.listen(3001, () => {
        console.log('Waiting for connection...');
    });
});

app.get('/api/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return console.log(err);

        res.send(users);
    });
});

app.get('/api/users/:id', (req, res) => {
    let id = req.params.id;

    User.findOne({_id: id}, (err, user) => {
        if (err) return console.log(err);

        res.send(user);
    });
});

app.post('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    let userName = req.body.name;
    let userAge = req.body.age;

    User.create({name: userName, age: userAge}, (err, doc) => {
        if (err) return console.log(err);

        res.send(doc)
    });
});

app.delete('/api/users/:id', (req, res) => {
    let id = req.params.id;

    User.findByIdAndDelete(id, (err, user) => {
        if (err) return console.log(err);

        res.send(user);
    });
});

app.put('/api/users', jsonParser, (req, res) => {
    if (!req.body) return console.log(err);

    let id = req.body.id;
    let userName = req.body.name;
    let userAge = req.body.age;

    let newUser = {
        name: userName,
        age: userAge
    };

    User.findByIdAndUpdate({_id: id}, newUser, {new: true}, (err, user) => {
        if (err) return console.log(err);

        res.send(user);
    });
});