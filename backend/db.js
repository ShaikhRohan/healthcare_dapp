const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1:27017/HealthcareDApp"
//const mongoURI = "mongodb+srv://obaidkhanimerwat:obaid%40123@cluster0.ekxewbf.mongodb.net/?retryWrites=true&w=majority"
const mongoURI = "mongodb+srv://rohan:Nin3tyyy@cluster0.ahij9rx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//
const connectToMongo  = async () =>{
  mongoose.connect(mongoURI, {useNewUrlParser: true})

}

module.exports = connectToMongo;