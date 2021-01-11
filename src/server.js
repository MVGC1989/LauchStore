// INICIANDO O SERVIDOR

let express = require('express')// require é o método do node que importa o que eu quero para dentro da variável no caso o express
let nunjucks = require('nunjucks') //nunjucks é uma engine que importa meus dados
let routes = require("./routes") //importando o arquivo routes
let method_override = require("method-override")//chamando o arquivo baixado

let server = express()// a variavel express virou uma função

server.use(express.urlencoded({extended: true}))//essa linha faz com que o req.body das rotas funcione
server.use(express.static('public')) // aqui vou usar para colocar o estilo dentro do servidor
server.use(method_override("_method"))/*configuração do override. Ela precisa vir antes da rota,
isso para que seja mudado o método antes de ir pra rota*/
server.use(routes) // esse comando serve para a rota ser importada e utilizada pelo servidor

server.set('view engine', 'njk')

nunjucks.configure('src/app/views',{// chamo onde esta o arquivo a pasta views
    express:server,
    autoescape: false, //permite q eu use html na descrição da variavel no caso site da rocketseat
    noCache: true
}) 

server.listen(5000, function (){
    console.log("server is running") 
}) 