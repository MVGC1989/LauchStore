const express = require("express")
const routes = express.Router() 

const multer = require("../app/middlewares/multer")

const SearchController = require("../app/controllers/SearchController")
const ProductController = require("../app/controllers/ProductController")

const {onlyUsers} = require("../app/middlewares/session")

//PÁGINA DE BUSCA
routes.get("/search", SearchController.index)

//CADASTRO DE PRODUTOS
routes.get('/create', onlyUsers, ProductController.create)
routes.get("/:id", ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit)
routes.post('/', onlyUsers, multer.array("photos", 6), ProductController.post)
routes.put("/", onlyUsers, multer.array("photos", 6), ProductController.put)
routes.delete("/", onlyUsers, ProductController.delete)

module.exports = routes 