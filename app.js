const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/';

const app = express();
const jsonParser = express.json();

const mongoCLient = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

let dbClient;

app.use(express.static(__dirname + '/public'));

mongoCLient.connect(function(err, client) {
    if (err) {
        return console.log(err);
    };

    dbClient = client;

    app.locals.collection = client.db('usersdb2').collection('users2');

    app.listen(3001, function () {
        console.log('Сервер ожидает подключение...');
    });
});

app.get('/api/users', function(req, res) {
    const collection = req.app.locals.collection;

    collection.find().toArray(function(err, users) {
        if (err) {
            return console.log(err);
        };

        res.send(users);
    });
});

app.get('/api/users/:id', function(req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;

    collection.findOne({_id: id}, function(err, user) {
        if (err) {
            return console.log(err);
        };

        res.send(user);
    });
});

app.post('/api/users', jsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    };

    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {
        name: userName,
        age: userAge
    };

    const collection = req.app.locals.collection;
    collection.insertOne(user, function(err, result) {
        if (err) {
            return console.log(err);
        };

        res.send(user);
    });
});

app.delete('/api/users/:id', function(req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;

    console.log(id)

    collection.findOneAndDelete({_id: id}, function(err, result) {
        if (err) {
            return console.log(err);
        };

        let user = result.value;

        res.send(user);
    });
});

app.put('/api/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    };

    const id = new objectId(req.body.id);
    const userName = req.body.name;
    const userAge = req.body.age;

    const collection = req.app.locals.collection;

    collection.findOneAndUpdate(
        {_id: id},
        {$set: {
            age: userAge,
            name: userName
        }},
        {returnOriginal: false},
        function(err, result) {
            if (err) {
                return console.log(err);
            };

            const user = result.value;

            res.send(user);
        }
    );
});

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});