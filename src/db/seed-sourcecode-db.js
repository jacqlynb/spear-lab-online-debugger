const fs = require('fs');
const mongoose = require('mongoose');
const Schema = require('../models/schema.js');


mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true, 
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})

const exceptionSchema = new mongoose.Schema({
  title: String,
  exception: [],
  log: [],
  sourceCode: []
});

const Exception = mongoose.model('Thing', exceptionSchema);

const currentException = new Exception({
  exception:[[
    {
      fileName: 'file1',
      lineNumber: 1,
      column: 0,
      methodName: 'method1',
      className: 'class1',
      content: 'content1'
    },
    {
      fileName: 'file2',
      lineNumber: 2,
      column: 0,
      methodName: 'method2',
      className: 'class2',
      content: 'content2'
    }]
  ],
  log: [],
  sourceCode: [
    {
      fileName: 'file1',
      codeLines: [{lineNumber: 1, codeLine: 'line1', documentTitle: 'title1'}]
    }, 
    {
      fileName: 'file1',
      codeLines: [{lineNumber: 2, codeLine: 'line2', documentTitle: 'title2'}]
    }]
});

currentException.save().then(() => {
  console.log('saved');
}).catch(err => {
  console.log(err);
}) 

          // const exceptionSchema = new Schema({
          //   title: String,
          //   exception: [[logSchema]],
          //   log: [],
          //   sourceCode: [{fileName: String, codeLines: [sourceCodeSchema]}]
          // });
          

