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
                description: "must be a float in [0, 100] and is required"
             },
             full_name: {
                bsonType: "string",
                description: "Student's fullname and is required"
             },
             grades: {
                bsonType: "array",
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
