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
  Exception.find({}).then(data => {
    let titles = [];
    data.map(item => {
      titles.push(item.title);
    })
    res.status(200).send(titles);
  }).catch(error => {
    res.status(404).send(error);
  });
});

app.get('/issues/:title', (req, res) => {
  console.log(req.params);
  Exception.findOne({ title: req.params.title }).then(data => {
    console.log(data);
    res.status(200).send(data);
  }).catch(error => {
    res.status(404).send(error);
  }); 
})

app.listen(port, () => console.log(`Listening on ${port}`));


// ***** Promise.all pattern *****
// Promise.all([findException, findSourceCode]).then(value => {
//     const [exceptionData, sourceCodeData] = value;

//     //const value = [exception]

//     res.status(200).send(value);

//     console.log(exceptionData);
//     console.log(sourceCodeData);
//   }).catch(error => {
//     console.log('Error: ', error);
//   });