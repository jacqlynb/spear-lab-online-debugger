const fs = require('fs');
const mongoose = require('mongoose');
const schema = require('../models/schema.js');
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
    
    let fileName = '';
    let sourceCode = [];
    let sourceCodeElement = {};
    
    // if the file is a subdirectory...
    if (outerDir.isDirectory()) {
      let outerDirName = file + '/';
      const innerDir = fs.readdirSync(dirName + file, { encoding: 'utf8' });
      
      // new exception document for each subdirectory
      let currentException = new Exception(
        { 
          title: outerDirName.replace('/', ''),
          exception: null,
          log: null,
          sourceCode: [{ fileName: null, codeLines: [] }]
        });
        
        // now map over each file in subdirectory
        innerDir.map(file => {
          let codeLines = [];
          let filePath = dirName + outerDirName + file;
          
          // const exceptionSchema = new Schema({
          //   title: String,
          //   exception: [[logSchema]],
          //   log: [],
          //   sourceCode: [{fileName: String, codeLines: [sourceCodeSchema]}]
          // });
          
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
            // create new source code element
            fileName = file;
            console.log("1 Source code file name = " + sourceCodeElement.fileName);
            
            let fileString = fs.readFileSync(filePath).toString();
            let fileStringTokenized = fileString.split('\n');
  
            fileStringTokenized.map((line, index) => {
              let currentLine = new SourceCode({
                lineNumber: index + 1,
                codeLine: line,
              })
              codeLines.push(currentLine);
            });
            sourceCodeElement.codeLines = codeLines;
            sourceCodeElement.fileName = fileName;
            console.log("source code element before pushing: ", sourceCodeElement.fileName)
            sourceCode.push(sourceCodeElement);
            sourceCodeElement = {};
          }
        });
        console.log("2 Source code file name = " + sourceCode[0].fileName);

        if (currentException.exception) {
          currentException.exception.forEach(callPath => {
            callPath.forEach(callPathElem => {
              sourceCode.forEach(sourceCodeElem => {
                sourceCodeElem.codeLines.forEach(line => {
                  if (callPathElem.lineNumber == line.lineNumber 
                      && line.codeLine.includes(callPathElem.methodName)) {
                        callPathElem.fileName = sourceCodeElem.fileName;
                  }
                })
              })
            });
          });
        }

        if (currentException.log) {
          currentException.log.forEach(callPath => {
            callPath.forEach(element => {
              sourceCode.forEach(line => {
                if (element.lineNumber == line.lineNumber && line.codeLine.includes(element.methodName)) {
                  element.fileName = line.documentTitle;
                }
              });
            });
          })
        }
    
      // after mapping over all files is completed, finally add source code array to exception object
      currentException.sourceCode = sourceCode;
      console.log("3 Source code file name = " + currentException.sourceCode[0].fileName);

      // save current exception document to database
      currentException.save().then(() => {
        // console.log(currentException.sourceCode.fileName);
      }).catch(err => {
        console.log(err);
      })
    };
  });
}); 