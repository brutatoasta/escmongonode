# MongoDB and NodeJS

script.js is an amalgamation of create.js, termly.js and average.js, written in an async manner.

script.js simulates a group of 20 SUTD students going through their 8 terms
and getting somehow random grades.

Flow:
1. Create a database named “sutd”
2. Inside that database, create a collection called “students”
3. Create 20 different student documents, with the following keys and values
requirement:
a. student_id (value should be a number)
b. average_grade (value should be a number, initial value of 0)
c. full_name (value should be a string)
d. grades (value should be an empty array)
e. term (value should be a number, initial value of 0)
4. Using a for loop, iterate 8 times, which, for each student, will:
a. generate four random numbers (between 0 and 100 both included) to be
added to the students grades
b. increment term by 1
5. After the 8 iterations are done, compute the average_grade for each student
based on the students grades
6. Display the sorted list of students with the highest average_grade first, using MongoDB's query language. The information of each student should be printed, with one
student per line using console.log().

## Dependencies
[Unique Names Generator](https://www.npmjs.com/package/unique-names-generator#dictionaries-available)
MIT License © Andrea SonnY
