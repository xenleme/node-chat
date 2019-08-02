const express = require('express');
const app = express();

const server = app.listen(3000, () => {
  console.log('sever is running on port', server.address().port);
});

app.use(express.static(__dirname));
