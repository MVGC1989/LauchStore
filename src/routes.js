const express = require("express")
const routes = express.Router() 
const multer = require("./app/middlewares/multer")
const Product_Controller = require("./app/controllers/Product_Controller")

routes.get('/', function( req , res){ //rota da página inicial
    return res.render("layout.njk")
})

routes.get('/products/create', Product_Controller.create)
routes.get("/products/:id", Product_Controller.show)
routes.get('/products/:id/edit', Product_Controller.edit)
routes.post('/products',multer.array("photos", 6), Product_Controller.post)
routes.put("/products",multer.array("photos", 6), Product_Controller.put)
routes.delete("/products", Product_Controller.delete)

routes.get('/ads/create', function(req , res){
    return res.redirect("/products/create")
})

module.exports = routes 