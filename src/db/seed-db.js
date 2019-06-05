const fs = require('fs');
const mongoose = require('mongoose');
const schema = require('../models/schema.js');
const Log = schema.Log;
const Exception = schema.Exception;

mongoose.connect('mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true, 
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})

let fileString = (fs.readFileSync('../sample-data/HADOOP-984.json')).toString();
let fileStringParsed = JSON.parse(fileString);
let exception = fileStringParsed.exception;
let log = fileStringParsed.log;
console.log(exception);
let currentException = new Exception({
   exception,
   log
});
currentException.save().then(() => {
  console.log(currentException.exception);
}).catch((error) => {
  console.log(error);
})
 