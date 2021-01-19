// INICIANDO O SERVIDOR

let express = require('express')
let nunjucks = require('nunjucks') 
let routes = require("./routes")
let method_override = require("method-override")

let server = express()

server.use(express.urlencoded({extended: true}))
server.use(express.static('public')) 
server.use(method_override("_method"))
server.use(routes) 
server.set('view engine', 'njk')

nunjucks.configure('src/app/views',{
    express:server,
    autoescape: false, 
    noCache: true
}) 

server.listen(5000, function (){
    console.log("server is running") 
}) 