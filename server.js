const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Message = mongoose.model('Message', {
  name: String,
  message: String
});

const dbUrl =
  'mongodb+srv://pavelb:<password>@chat-snezt.mongodb.net/test?retryWrites=true&w=majority';

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  Message.find({ name: user }, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);

    const savedMessage = await message.save();
    console.log('Saved');

    const censored = await Message.findOne({ message: 'Badword' });
    if (censored) await Message.remove({ _id: censored.id });
    else io.emit('Message', req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.log('Error', error);
  } finally {
    console.log('Message posted');
  }
});

io.on('connection', () => {
  console.log('User is connected');
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, err => {
  console.log('Mongodb connected', err);
});

const server = http.listen(3000, () => {
  console.log('Server is running on port', server.address().port);
});
