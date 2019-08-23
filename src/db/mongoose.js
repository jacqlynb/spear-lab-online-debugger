const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sample-data', {
  useNewUrlParser: true,
  useCreateIndex: true
}).catch((error) => {
  console.log("Error connecting to database:", error);
})