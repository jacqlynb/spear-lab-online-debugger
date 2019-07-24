const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const schema = require("./src/models/schema");
const Exception = schema.Exception;
require("./src/db/mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true, 
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})


const dirName = './src/sample-data/HADOOP-2486';

function parse () {

  console.log("called")
  fs.readFile(dirName + "/HADOOP-2486.json", (err, data) => {
    const lineNumbers = [];
    if (err) { console.log(err) }
    else { 
      const dataParsed = JSON.parse(data);
      dataParsed.log.forEach(log => {
        log.forEach(line => {
          if (line.lineNumber) { 
            lineNumbers.push(line.lineNumber) };
        })
      });
    }
    console.log(lineNumbers);

    const rl = readline.createInterface({
      input: fs.createReadStream(dirName + "/reduceTask.java"),
      crlfDelay: Infinity
    });

    let level = 0;
    

    rl.on('line', (line) => {
      if (line.includes("{") && noBlockKeyWords(line)) {
        console.log(line);
        level++;
        console.log("level: ", level);
      }
      if (line.includes("{") && noBlockKeyWords(line)) { 
        console.log(line);
        level--;
        console.log("level: ", level);
      }
    });
  })
}

function noBlockKeyWords(line) {
  return (
  (!(line.includes("if")) && 
  !(line.includes("else")) && 
  !(line.includes("else if")) && 
  !(line.includes("throw")) &&
  !(line.includes("catch")) &&
  !(line.includes("try")) && 
  !(line.includes("finally")) && 
  !(line.includes("for")) &&
  !(line.includes("while")) && 
  !(line.includes("*"))));
}

parse();

module.exports = {
  parse: parse
}