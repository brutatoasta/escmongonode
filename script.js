var mongo = require('mongodb');
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const config = {
  dictionaries: [names]
};
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);


async function main(){
    await client.connect();
    const database = client.db("sutd");
    const collection = database.collection("students");

    await collection.drop(); //Drops table for repeated testing
    // initial creation of entries
    var inititalBulkWrite = [];
    for (let i = 0; i < 20; i++) {
        inititalBulkWrite.push(
            {
                "insertOne":{
                        "student_id" : i,
                        "average_grade": 0.0,
                        "full_name": getRandomName(),
                        "grades": [],
                        "term": 0
                    }
                }    
        );
    }
    // apparently await not required for bulkWrite
    collection.bulkWrite(inititalBulkWrite,
        {"ordered": true, "w": 1}, function(err, result) {
            // do something with result
            console.log(err);
        });
    
    // termly grade updates
    for (let t = 0; t< 8; t++){
        //increment term by 1
        await collection.updateMany(
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
        }
        collection.bulkWrite(newGradesBulkWrite,
            {"ordered": true, "w": 1}, function(err, result) {
                // do something with result
                console.log(err);
            });
         
    }
    //average grades
    for (let k = 0; k < 20; k++) {
        let total = await collection.findOne({"student_id": k}).then((res) => {
            let sum = 0;
            for (let idx in res.grades) {
                sum += parseFloat(res.grades[idx]);
            }
            return sum
        })
        avg = (total/8).toFixed();
        await collection.updateOne({student_id: k}, {$set: {average_grade: avg}})
    }
    // display da student
    var honorRoll = await collection.find().sort({average_grade: -1}).toArray(); //need to array-inator the cursor so its printable
    for (let graduate in honorRoll ){
        
        console.log(honorRoll[graduate].full_name + ": " + honorRoll[graduate].average_grade);
    }
}

// execute
main()
  .catch(console.error)
  .finally(() => client.close()); // close connection

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

function getRandomName(){
    return uniqueNamesGenerator(config)+ " " +  uniqueNamesGenerator(config)
  }