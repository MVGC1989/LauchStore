const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const {formatPrice, date} = require("../../lib/utils")

module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render('products/create', {categories})
        } catch (error) {
            console.error(error)
        }
    },

    async post(req , res){
        try {
            const keys = Object.keys(req.body) 
                for( key of keys){
                    if(req.body[key]== ""){
                        return res.send("Por favor, preencha todos os campos!")
                    }
                }

            if(req.files.length == 0){
                return res.send("Por favor, envie pelo menos uma imagem!")
            }

            let { category_id, name, description, old_price, price, quantity, status} = req.body
            
            price = price.replace(/\D/g, "")

            const product_id = await Product.create({
                category_id,
                user_id: req.session.userId,
                name, 
                description, 
                old_price: old_price || price, 
                price, 
                quantity, 
                status: status || 1
            })

        const files_promise = req.files.map(file=>{File.create({
            ...file, product_id
        })})
        await Promise.all(files_promise)

        return res.redirect(`/products/${product_id}`)
        } catch (error) {
            console.error(error)
        }
        
    },

    async show(req,res){
        try {
            const product = await Product.find(req.params.id)

            if(!product){
                return res.send("Produto não encontrado!")
            }
    
            const { hour, minutes, day, month, year} = date(product.updated_at)
    
            product.published ={
                hour: `${hour}h${minutes}`,
                day:`${day}/${month}/${year}`,
            }
    
            if(product.old_price) {
                product.oldPrice = formatPrice(product.old_price)
            }
            product.price = formatPrice(product.price)
    
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
    
            return res.render("products/show", {product , files})
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req , res){
        try {
            const product = await Product.find(req.params.id)

            if(!product){return res.send("Produto não encontrado!")}
        
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)//formata o price na edição
    
            //pegando categorias
            const categories = await Category.findAll()

            //pegando imagens
            let files = await Product.files(product.id)

            files = files.map(file =>({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("products/edit", {product , categories, files})

        } catch (error) {
            console.error(error)
        }
    },

    async put(req , res){
        try {
            const keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== "" && key != "removed_files"){
                    return res.send("Por favor, preencha todos os campos!")
                }
            }

            if(req.body.removed_files){//removendo foto
                const removedFiles = req.body.removed_files.split(",")
                const last_index = removedFiles.length -1
                removedFiles.splice(last_index, 1)
                
                const removed_files_promise = removedFiles.map(id => File.delete(id))
                    await Promise.all(removed_files_promise)
            }
    

            if(req.files.length != 0){//salvando fotos na edição

                //validar se já não existem 06 fotos no total
                const oldFiles = await Product.files(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6){
                    const new_files_promise = req.files.map(file=>File.create({
                        ...file, 
                        product_id: req.body.id
                    }))
                    await Promise.all(new_files_promise)
                }
            }

            req.body.price = req.body.price.replace(/\D/g, "")

            if(req.body.old_price != req.body.price){
                const old_product = await Product.find(req.body.id)
                req.body.old_price = old_product.rows[0].price
            }
            
            await Product.update(req.body.id, {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status,
            })

            return res.redirect(`/products/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
        
    },

    async delete(req , res){
        await Product.delete(req.body.id)

        return res.redirect("/products/create")
    }
}