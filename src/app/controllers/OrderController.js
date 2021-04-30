const LoadProductService = require('../services/LoadProductService')
const User = require("../models/User")

const mailer = require('../../lib/mailer')

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
            //pegar o produto
            const product = await LoadProductService.load('product', {where: {id:req.body.id}})

            //dados do vendedor
            const seller = await User.findOne({where: {id: product.user_id}})

            //dados do comprador
            const buyer = await User.findOne({where: {id: req.session.userId}})

            //enviar email com dados da compra para o vendedor
            await mailer.sendMail({
                to: seller.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Novo Pedido de Compra',
                html: email(seller, product, buyer)
            })

            //notificar usuário com menssagem de sucesso
            return res.render('orders/success')
        } catch (error) {
            console.error(error)
            return res.render('orders/error')
        }
    }
}