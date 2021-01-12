const {formatPrice, date} = require("../../lib/utils")

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async create(req, res) {
        try {
            let results = await Category.all()
            const categories = results.rows
                
            return res.render('products/create', {categories})
        } catch (error) {
            console.error(error)
        }
    },

    async post(req , res){
        const keys = Object.keys(req.body) 
        for( key of keys){
            if(req.body[key]== ""){
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        if(req.files.length == 0){
            return res.send("Por favor, envie pelo menos uma imagem!")
        }

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const files_promise = req.files.map(file=>{File.create({
            ...file, 
            product_id: productId
        })})
        await Promise.all(files_promise)

        return res.redirect(`/products/${productId}`)
    },

    async show(req,res){

        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
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

        results = await Product.files(product.id)
        const files = results.rows.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/show", {product , files})
    },

    async edit(req , res){

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product){return res.send("Produto não encontrado!")}
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)//formata o price na edição
    
        //pegando categorias
        results = await Category.all()
        const categories = results.rows

        //pegando imagens
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file =>({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/edit", {product , categories, files})

    },

    async put(req , res){
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
            const totalFiles = oldFiles.rows.lenght + req.files.lenght

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
        await Product.update(req.body)
        return res.redirect(`/products/${req.body.id}`)
    },

    async delete(req , res){
        await Product.delete(req.body.id)

        return res.redirect("/products/create")
    }
}