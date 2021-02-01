const User = require("../models/User")
const {compare} = require('bcryptjs')

function checkAllFields(body){
    const keys = Object.keys(body) 
        for( key of keys){
            if(body[key]== ""){
                return {
                    user: body,
                    error: "Por favor, preencha todos os campos !"
                }
            }
        }
}

async function show (req, res, next){
    const {userId : id} = req.session

    const user = await User.findOne({where: {id}})

    if(!user) return res.render("user/register", {
        error: "Usuário não encontrado !"
    })

    req.user = user

    next()
}

async function post (req , res , next){
     //checar se todos os campos estão preenchidos

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("user/register", fillAllFields)
    }

     //checar se usuário já existe

        let { email, cpf_cnpj, password, passwordRepeat} = req.body

        cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

        const user = await User.findOne({
            where: {email},
            or: {cpf_cnpj}
        })

        if(user){ return res.render("user/register", {
            user: req.body,
            error: "Usuário já cadastrado !"
        })}

        //checar se a senha é a mesma

        if(password != passwordRepeat){
            return res.render("user/register", {
                user: req.body,
                error: "As senhas são diferentes !"
            })}
        

        next()
}

async function update(req, res, next){
    //checando campos
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("user/index", fillAllFields)
    }

    //checando se a senha foi preenchida

    const {id , password} = req.body

    if(!password) return res.render("user/index", {
        user: req.body,
        erro: "É necessário digitar sua senha para atualizar o cadastro !"
    })

    //ver se a senha esta certa

    const user = await User.findOne({ where: {id}})

    const passed = await compare(password , user.password)

    if(!passed) return res.render("user/index", {
        user: req.body,
        erro: "Senha incorreta !"
    })

    req.user = user

    next()
}
module.exports = {
    post,
    show,
    update
}