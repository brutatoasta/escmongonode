// import { uniqueNamesGenerator, names } from 'unique-names-generator';
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const config = {
  dictionaries: [names]
}

function getRandomName(){
  return uniqueNamesGenerator(config)+ " "+  uniqueNamesGenerator(config)
}
console.log(getRandomName())