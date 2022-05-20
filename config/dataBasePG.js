const  postgresqlPG  = require('./configPG');


let pgp = require('pg-promise')();
const db = pgp(postgresqlPG);


module.exports = db


