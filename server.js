const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectID;
const schema = require("./src/models/schema");
const Exception = schema.Exception;
const parser = require("./source-code-parser");
const parse = parser.parse;
require("./src/db/mongoose");


app.use(express.json());

app.get("/hello", (req, res) => {
  Exception.find({})
    .then(data => {
      let titles = [];
      data.map(item => {
        titles.push(item.title);
      });
      res.status(200).send(titles);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

app.get("/issues/:title", (req, res) => {
  console.log(req.params);
  parse();
  Exception.findOne({ title: req.params.title })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => res.status(404).send(error));
});

app.get("/2486", (req, res) => {
  Exception.findOne({ _id: ObjectId("5d24dfc74fbe7df3e63866a0") })
    .then(data => {
      console.log(data)
      res.status(200).send(data);
    })
    .catch(err => res.status(404).send(err));
});

app.get("/2486-with-levels", (req, res) => {
  Exception.findOne({ _id: ObjectId("5d3609550b87e2309e284826")})
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => res.status(404).send(err));
});

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
