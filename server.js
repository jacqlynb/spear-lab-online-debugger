const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
require('./src/db/mongoose')


const schema = require('./src/models/schema');

const Exception = schema.Exception;
const SourceCode = schema.SourceCode;


app.use(express.json());

app.get('/hello', (req, res) => {

  const findException = Exception.find({});
  const findSourceCode = SourceCode.find({}).sort('documentTitle').sort('lineNumber');

  Promise.all([findException, findSourceCode]).then(value => {
    const [exceptionData, sourceCodeData] = value;

    //const value = [exception]

    res.status(200).send(value);

    console.log(exceptionData);
    console.log(sourceCodeData);
  }).catch(error => {
    console.log('Error: ', error);
  });
});

app.listen(port, () => console.log(`Listening on ${port}`));