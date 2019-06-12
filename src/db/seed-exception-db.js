const fs = require('fs');
const mongoose = require('mongoose');
const schema = require('../models/schema.js');
const Log = schema.Log;
const Exception = schema.Exception;
const SourceCode = schema.SourceCode;

mongoose.connect('mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true, 
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})

let dirName = '../sample-data/';

/* reads into sample-data directory, then into each subdirectory, mapping over all enclosed 
files and storing their data into a new exception document */
fs.readdir(dirName, (err, files) => {
  if (err) {
    return 'Error: ' + err;
  }
  // map over each file in sample-data directory
  files.map(file => { 
    let outerDir = fs.statSync(dirName + file);
    
    // if the file is a subdirectory...
    if (outerDir.isDirectory()) {
      let outerDirName = file + '/';
      const innerDir = fs.readdirSync(dirName + file, { encoding: 'utf8' });

      const sourceCode = [];

      // new exception document for each subdirectory
      let currentException = new Exception(
        { 
          exception: null,
          log: null,
          sourceCode: null
        });

      // now map over each file in subdirectory
      innerDir.map(file => {
        let filePath = dirName + outerDirName + file;

        // if .json extension, save as exception data
        if (file.includes('.json')) {
          let fileString = fs.readFileSync(filePath).toString();
          let fileStringParsed = JSON.parse(fileString);
          let exception = fileStringParsed.exception;
          let log = fileStringParsed.log;

          // only one .json file per directory, so can be added to exception document now
          currentException.exception = exception;
          currentException.log = log;
        }

        // if .java extension, save as source code data
        if (file.includes('.java')) {
          let fileString = fs.readFileSync(filePath).toString();
          let fileName = file;
          let fileStringTokenized = fileString.split('\n');

          fileStringTokenized.map((line, index) => {
            currentLine = new SourceCode({
              lineNumber: index + 1,
              codeLine: line,
              documentTitle: fileName
            })

            sourceCode.push(currentLine);
          });
        }
      });

      // after mapping over all files is completed, finally add source code array to exception object
      currentException.sourceCode = sourceCode;

      // save current exception document to database
      currentException.save().then(() => {
        console.log(currentException);
      }).catch(err => {
        console.log(err);
      })
    }
  });
}); 