const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  fileName: String,
  lineNumber: Number,
  column: Number,
  methodName: String,
  className: String,
  content: String 
});

const sourceCodeSchema = new Schema({
  lineNumber: Number,
  codeLine: String,
  documentTitle: String
});

const exceptionSchema = new Schema({
  title: String,
  exception: [[logSchema]],
  log: [],
  sourceCode: []
});

const Exception = mongoose.model('Exception', exceptionSchema);
const Log = mongoose.model('Log', logSchema);
const SourceCode = mongoose.model('SourceCode', sourceCodeSchema);


module.exports = {
  Exception, 
  Log, 
  SourceCode
}