const Cart = require('../../lib/cart')

const LoadProductsService = require('../services/LoadProductService')

module.exports = {
    async index(req , res){
        try {
            let { cart } = req.session

            //gerenciador de carrinho
            cart = Cart.init(cart)

            return res.render("cart/index", {cart})

        } catch (error) {
            console.error(error)
        }
    },

    async addOne (req, res){
        //pegar id do produto e o produto
        const {id} = req.params

        const product = await LoadProductsService.load('product', {where:{id}})

        //pegar carrinho da sessão
        let {cart} = req.session

        //add o produto ao carrinho usando o gerenciador
        cart = Cart.init(cart).addOne(product)

        //atualizar o carrinho da sessão
        req.session.cart = cart

        //redirecionar o usuário para tela do carrinho
        return res.redirect('/cart')
    },

    removeOne(req, res){
        //pegar id do produto e o produto
        let {id} = req.params
        
        //pegar o carrinho da sessão
        let {cart} = req.session

        //retornar se não tiver carrinho
        if(!cart){ return res.redirect('/cart')}

        //iniciar o carrinho (gerenciador)
        cart = Cart.init(cart).removeOne(id)

        //atualizar carrinho removendo item
        req.session.cart = cart

        //redirecionar pagina cart
        return res.redirect('/cart')
    }, 

    delete(req, res){
        let {id} = req.params
        let {cart} = req.session

        if(!cart){ return res.redirect('/cart')}

        cart = Cart.init(cart).delete(id)

        req.session.cart = cart

        return res.redirect('/cart')
    }
}