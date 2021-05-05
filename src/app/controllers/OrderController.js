const LoadProductService = require('../services/LoadProductService')
const User = require("../models/User")
const Order = require("../models/Order")

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto.</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br/><br/></p>
<h3>Dados do Comprador</h3>
<p>Nome: ${buyer.name}</p>
<p>Email: ${buyer.email}</p>
<p>Endereço: ${buyer.address}</p>
<p>CEP: ${buyer.cep}</p>
<p><br/><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a venda.</strong></p>
<p><br/><br/></p>
<p>Atenciosamente, Equipe LaunchStore.</p>
`

module.exports = {
    async post(req , res){
        try {
            // pegar os produtos do carrinho
            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.userId 

            const filteredItems = cart.items.filter(item =>
                item.product.user != buyer_id
            )

            //criar pedido
            const createOrdersPromise = filteredItems.map( async item => {
                let {product, price:total, quantity} = item
                const {price, id:product_id, user_id: seller_id} = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                //pegar dados do produto
                product = await LoadProductService.load('product', {where: {id: product_id}})

                //dados do vendedor
                const seller = await User.findOne({where: {id: seller_id}})

                //dados do comprador
                const buyer = await User.findOne({where: {id: buyer_id}})

                //enviar email com dados da compra para o vendedor
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com.br',
                    subject: 'Novo Pedido de Compra',
                    html: email(seller, product, buyer)
                })

                return order
            })

            await Promise.all(createOrdersPromise)

            //notificar usuário com menssagem de sucesso
            return res.render('orders/success')
        } catch (error) {
            console.error(error)
            return res.render('orders/error')
        }
    }
}