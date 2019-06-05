const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true,
  useCreateIndex: true
}).catch((error) => {
  console.log(error);
})