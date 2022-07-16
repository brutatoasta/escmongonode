var mongo = require('mongodb');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const config = {
  dictionaries: [names]
};
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);
const database = client.db("sutd");
const collection = database.collection("students");

// calculate average grade
var avgGradesBulkWrite = [];
avgGrades = collection.find({"full_name": "Merline Netti"});
//console.log(avgGrades);
console.log(avgGrades.grades);