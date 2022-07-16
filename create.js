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

// validator for required fields
database.createCollection("students", {
    validator: {
       $jsonSchema: {
          bsonType: "object",
          required: [ "student_id", "average_grade", "full_name", "grades", "term" ],
          properties: {
             student_id: {
                bsonType: "int",
                description: "must be a string and is required"
             },
             average_grade: {
                bsonType: "double",
                minimum: 0,
                maximum: 100,
                description: "must be a float in [ 0, 100 ] and is required"
             },
             full_name: {
                bsonType: "String",
                description: "Student's fullname and is required"
             },
             grades: {
                bsonType: "Array",
                description: "Array of students grades as floats, is required, initally empty"
             },
             term: {
                bsonType: "int",
                description: "Students current school term and is required"
             }
          }
       }
    }
 })

 // initial creation
var inititalBulkWrite = [];
for (let i = 0; i < 20; i++) {
    inititalBulkWrite.push(
        {
            "insertOne":{
                "filter": {},
                "update": {
                    student_id : 1005000 + i,
                    average_grade: 0.00,
                    full_name: getRandomName(),
                    grades: [],
                    term: 0
                }
            }    
    });
  }
  collection.bulkWrite(inititalBulkWrite,
    {"ordered": true, "w": 1}, function(err, result) {
        // do something with result
        console.log(err);
    });

    
function getRandomName(){
    return uniqueNamesGenerator(config)+ " "+  uniqueNamesGenerator(config)
  }