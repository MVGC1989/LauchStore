const express = require("express")
const routes = express.Router() 

const HomeController = require("../app/controllers/HomeController")

const products = require("./products")
const users = require("./users")
const cart = require("./cart")
const orders = require("./orders")

routes.use("/products", products)
routes.use("/users", users)//vai colocar um /users em todas as rotas dos usuários
routes.use("/cart", cart)
routes.use("/orders", orders)


//HOME
routes.get('/', HomeController.index)

//ATALHOS
routes.get('/ads/create', function(req , res){
    return res.redirect("/products/create" )
})

routes.get('/accounts', function(req , res){
    return res.redirect("/users/login" )
})


module.exports = routes 