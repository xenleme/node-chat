const express = require('express');
const app = express();

const server = app.listen(3000, () => {
  console.log('sever is running on port', server.address().port);
});

app.use(express.static(__dirname));

const mongoose = require('mongoose');
const dbUrl =
  'mongodb+srv://pavelb:<password>@chat-snezt.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbUrl, err => {
  console.err('mongodb connected', err);
});

const Message = mongoose.model('Message', { name: String, message: String });

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
