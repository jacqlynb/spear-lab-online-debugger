const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
require('./src/db/mongoose')

const schema = require('./src/models/schema');
const Exception = schema.Exception;
const Log = schema.Log;

app.use(express.json());

app.get('/hello', (req, res) => {
  console.log('worked');
  Exception.find({}).then((exceptions) => {
    console.log(exceptions[0]);
    res.send(exceptions[0].exception[0][0]);
  }).catch((error) => {
    console.log(error);
  })
})

app.listen(port, () => console.log(`Listening on ${port}`));