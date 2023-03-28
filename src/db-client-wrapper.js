const mongo = require("mongodb");

const client = new mongo.MongoClient("mongodb://127.0.0.1:27017");

client.connect((err) => {
    err ? console.log("Error connecting to MongoDB") : console.log("Connected to MongoDB");
});

module.exports = client;