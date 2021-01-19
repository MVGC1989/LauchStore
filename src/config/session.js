//Seção de usuários
//npm install express-session connect-pg-simple

const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require("./db")

module.exports = session({
    store: new pgSession({
        pool: db
    }),
    secret: "marcos89",
    resave: false,
    saveUninitialized:false,
    cookie: {
        maxAge: 30 * 24 * 60 * 1000 //tempo de seção ativa
    }
})
