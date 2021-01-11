//CONEXÃO DO BANCO DE DADOS

var { Pool } = require ("pg") /* esse pool serve para conectar o banco de dados 
automaticamente sem precisar que toda vez eu digite login e senha*/

module.exports = new Pool({
    user: 'postgres',
    password: "marcos89",
    host:"localhost",
    port: 5432,
    database: "launchstoredb"
})