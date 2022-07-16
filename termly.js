var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);
const database = client.db("sutd");
const collection = database.collection("students");

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
        newGrades = Array(4).fill().map(() => getRandomGrade());
        
        newGradesBulkWrite.push(
            {
                "updateOne":{
                    "filter": {student_id: j},
                    "update": {$push:{grades: {$each: newGrades}}}
                }    
        });
        // collection.findOneAndUpdate(
        //     {student_id: j},
        //     {$push:{grades: {$each: newGrades}}}
        // );
    }
    collection.bulkWrite(newGradesBulkWrite,
        {"ordered": true, "w": 1}, function(err, result) {
            // do something with result
            console.log(err);
        });
}

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
    //toFixed returns a string
}