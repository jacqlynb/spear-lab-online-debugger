const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  lineNumber: Number,
  column: Number,
  methodName: String,
  className: String,
  content: String 
});

const exceptionSchema = new Schema({
  exception: [[logSchema]],
  log: []
});

const Exception = mongoose.model('Exception', exceptionSchema);
const Log = mongoose.model('Log', logSchema);

module.exports = {
  Exception, 
  Log
}