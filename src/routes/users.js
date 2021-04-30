const express = require("express")
const routes = express.Router() 

const SessionController = require("../app/controllers/SessionController")
const UserController = require("../app/controllers/UserController")
const OrderController = require("../app/controllers/OrderController")

const UserValidator = require("../app/Validators/user")
const SessionValidator = require("../app/Validators/session")

const {isLoggedRedirectToUsers, onlyUsers} =require("../app/middlewares/session") 

//LOGIN-LOGOUT USUÁRIO

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

//TROCAR OU RECUPERAR A SENHA

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

//CADASTRO DE USUÁRIOS

routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)
routes.get('/', onlyUsers, UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)
routes.delete('/', UserController.delete)

//LISTAR PRODUTOS DE UM USUÁRIO

routes.get('/ads', UserController.ads)

//PEDIDOS DE COMPRA
routes.post('/orders', onlyUsers, OrderController.post)

module.exports = routes 