const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/HealthcareDApp"

const connectToMongo  = async () =>{
  mongoose.connect(mongoURI, {useNewUrlParser: true})

}

module.exports = connectToMongo;