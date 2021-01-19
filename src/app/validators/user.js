const User = require("../models/User")

async function post (req , res , next){
     //checar se todos os campos estão preenchidos

    const keys = Object.keys(req.body) 
        for( key of keys){
            if(req.body[key]== ""){
                return res.render("user/register", {
                    user: req.body,
                    error: "Por favor, preencha todos os campos !"
            })}
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

module.exports = {
    post
}