const { create } = require("browser-sync")
const db = require("../../config/db")
const {hash} = require("bcryptjs")//npm install bcryptjs

module.exports = {
    async  findOne(){
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key =>{
            query = `${query} ${key}`

            Object.keys(filters[key]).map(field =>{
                query = `${query} ${field} = ${filter[key] [field]}`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },

    async create(data){
        try{
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`

        //senha criptografada
        const passwordHash = await hash(data.password , 8)//8 é força da senha

        const values = [
            data.name,
            data.email,
            passwordHash,
            data.cpf_cnpj.replace(/\D/g,""),
            data.cep.replace(/\D/g,""),
            data.address,
        ]

        const results = await db.query(query , values)
        return results.rows[0].id
        
        }catch(error){
            console.error(error)
        }
        
    }
}