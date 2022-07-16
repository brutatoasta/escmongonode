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
                bsonType: "float",
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
                    full_name: uniqueNamesGenerator(config),
                    grades: [],
                    term: 0
                }
            }    
    });
  }
  collection.bulkWrite(inititalBulkWrite,
    {"ordered": true, "w": 1}, function(err, result) {
        // do something with result
        callback(err); 
    });

// termly grade updates

for (let t = 0; t< 8; t++){
    //increment term by 1
    collection.updateMany(
        {},
        {$inc:{term:1}}
    );
    var newGradesBulkWrite = [];
    // add random grades for each student
    for (let j = 0; j < 20; j++) {
        newGrades = Array(4).fill(getRandomGrade());
        newGradesBulkWrite.push(
            {
                "findOneAndUpdate":{
                    "filter": {student_id: 1005000 +j},
                    "update": {$push:{grades: {$each: newGrades}}}
                }    
        });
        // collection.findOneAndUpdate(
        //     {student_id: 1005000 +j},
        //     {$push:{grades: {$each: newGrades}}}
        // );
    }
    collection.bulkWrite(newGradesBulkWrite,
        {"ordered": true, "w": 1}, function(err, result) {
            // do something with result
            callback(err); 
        });
}



// calculate average grade
var avgGradesBulkWrite = [];
avgGrades = collection.find().grades;
    // add random grades for each student
    for (let j = 0; j < 20; j++) {
        
        newGradesBulkWrite.push(
            {
                "findOneAndUpdate":{
                    "filter": {student_id: 1005000 +j},
                    "update": {$push:{average_grade: avgGrades[i]}}
                }    
        });
        // collection.findOneAndUpdate(
        //     {student_id: 1005000 +j},
        //     {$push:{grades: {$each: newGrades}}}
        // );
    }
    collection.bulkWrite(newGradesBulkWrite,
        {"ordered": true, "w": 1}, function(err, result) {
            // do something with result
            callback(err); 
        });
async function get_data_from_db() {
try {
const dbo = client.db('<db>');
const collec = dbo.collection('<collection>');
const query = {};
const result = await collec.find().toArray();
console.log(result);
} finally { // closing connection no matter what
await client.close();
}
}
// Calling get_data_from_db()
get_data_from_db().catch(console.dir);


// Generates a normally distributed random number between 0 and 1 using Box-Muller transform from
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num;
  }

function getRandomGrade(){
    rawGrade = randn_bm();
    grade = 100 * (randn_bm() +0.2);
    if (grade>100.0){
        grade = 100.0
    }
    return grade.toFixed(2);
}

function getRandomName(){
    return uniqueNamesGenerator(config)+ " "+  uniqueNamesGenerator(config)
  }