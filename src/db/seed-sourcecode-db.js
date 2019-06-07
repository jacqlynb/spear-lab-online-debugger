const fs = require('fs');
const mongoose = require('mongoose');
const schema = require('../models/schema.js');
const SourceCode = schema.SourceCode;

mongoose.connect('mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true, 
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})

let fileString1 = (fs.readFileSync('../sample-data/FSDataInputStream.java')).toString();
let fileName1 = "FSDataInputStream.java";

let fileString2 = (fs.readFileSync('../sample-data/FSInputStream.java')).toString();
let fileName2 = "FSInputStream.java";

// Seed first document
fileString1Split = fileString1.split('\n');
fileString1Split.map((line, index) => {
  currentLine = new SourceCode({
    lineNumber: index + 1,
    codeLine: line,
    documentTitle: fileName1
  })
  currentLine.save().then(() => {
    console.log(currentLine);
  }).catch((error) => {
    console.log(error);
  })
  return(currentLine);
})

// Seed second document
fileString2Split = fileString2.split('\n');
fileString2Split.map((line, index) => {
  currentLine = new SourceCode({
    lineNumber: index + 1,
    codeLine: line,
    documentTitle: fileName2
  })
  currentLine.save().then(() => {
    console.log(currentLine);
  }).catch((error) => {
    console.log(error);
  })
  return(currentLine);
})

