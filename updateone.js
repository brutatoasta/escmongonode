var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);
const database = client.db("sutd");
const collection = database.collection("students");

// termly grade updates

// collection.updateOne(
//     {student_id : 0},
//     {$push:{grades: [22]}}
// );
for (let j = 0; j < 20; j++) {
    newGrades = Array(4).fill().map(() => getRandomGrade());
    console.log("newGrades: " + newGrades);
    collection.findOneAndUpdate(
        {student_id: j},
        {$set:{grades: []}}
    );
};

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num;
  };

function getRandomGrade(){
    rawGrade = randn_bm();
    grade = 100 * (randn_bm() +0.2);
    if (grade>100.0){
        grade = 100.0
    }
    return grade.toFixed(2);
    //toFixed returns a string
};