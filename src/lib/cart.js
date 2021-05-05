const {formatPrice} = require('./utils')

// O CARRINHO FICA GUARDADO NA SESSÃO DO USUÁRIO (req.session)

const Cart = {
    init(oldCart){
        if(oldCart){
            this.items = oldCart.items
            this.total = oldCart.total
        } else {
            this.items = []
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice : formatPrice(0)
            }
        }
        
        return this
    } ,

    // ADICIONAR 1 ITEM NO CARRINHO
    addOne(product){
        //ver se produto ja existe no carrinho
        let inCart = this.getCartItem(product.id)

        //se não existe, adicionar um
        if(!inCart){
            inCart = {
                product:{
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
            this.items.push(inCart)
        }

        //verificar se o numero de produtos do carrinho é maior que o numero de produtos disponiveis
        if(inCart.quantity >= product.quantity){
            return this
        }

        //atualizando um item do carrinho
        inCart.quantity++
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        //atualizando todo carrinho
        this.total.quantity++
        this.total.price += inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        return this
    },

    // REMOVER UM ITEM DO CARRINHO
    removeOne(productId){
        //pegar o item do carrinho
        const inCart = this.getCartItem(productId)

        if(!inCart){
            return this
        }

        //atualizar o item
        inCart.quantity--
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        //atualizar carrinho
        this.total.quantity--
        this.total.price -= inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        if(inCart.quantity < 1 ){
            this.items = this.items.filter(item => 
                item.product.id != inCart.product.id)
            return this
        }

        return this

    },

    // DELETAR OS ITEMS DO CARRINHO
    delete(productId){
        const inCart = this.getCartItem(productId)

        if(!inCart){ return this }

        if(this.items.length > 0){
            this.total.quantity -= inCart.quantity
            this.total.price -= (inCart.product.price * inCart.quantity)
            this.total.formattedPrice = formatPrice(this.total.price)
        }

        this.items = this.items.filter(item => inCart.product.id != item.product.id)
        return this
    },

    getCartItem(productId){
        return this.items.find(item => item.product.id == productId)
    }
} 

module.exports = Cart

