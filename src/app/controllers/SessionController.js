const User = require("../models/User")

const crypto = require('crypto')
const {hash} = require('bcryptjs')
const mailer = require("../../lib/mailer")

module.exports ={
    loginForm(req , res){
        return res.render("session/login")
    },

    login(req , res){
        req.session.userId = req.user.id 
        return res.redirect("/users")
    },

    logout(req , res){
        req.session.destroy()
        return res.redirect("/")
    },

    forgotForm(req , res){
        return res.render("session/forgot-password")
    },

    async forgot(req , res){
        const user = req.user

        try{
             //Criar Token
            const token = crypto.randomBytes(20).toString("hex")

            //Criar uma expiração do token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)//uma hora para expirar

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            //Enviar email com link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: "no-reply@launchstore.com.br",
                subject: "Recuperação de Senha",
                html: `
                    <h2>Perdeu sua senha?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                    RECUPERAR SENHA
                    </a>
                </p>
                `
            })

            //Avisar usuário do email enviado
            return res.render("session/forgot-password", {
                success: "Verifique seu e-mail para recuperar sua senha !"
            })

        }catch(error){
            console.error(error)
            return res.render("session/forgot-password", {
                error: "Erro inesperado. Tente novamente !"
            })
        }
    },

    resetForm(req, res){
        return res.render("session/password-reset", {token: req.query.token})
    },

    async reset(req, res){
        const user = req.user
        const {password , token} = req.body

        try{
            //Criar novo hash de senha
            const newPassword = await hash(password, 8)
            
            //Atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            //Avisa o usuário que ele tem uma nova senha
            return res.render("session/login", {
                user:req.body,
                success: "Senha atualizada com sucesso!"
            })

        }catch(error){
            console.error(error)
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado. Tente novamente !"
            })
        }
    }
}
