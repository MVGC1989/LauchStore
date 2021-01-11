//Armazenamento de arquivos de imagem
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images")
    },

    filename: (req, file, cb) =>{
        cb(null, `${Date.now().toString()}-${file.originalname}`)//data na frente do nome do arquivo para não conflitar com outro arquivo
    }
})

const file_filter = (req, file, cb) => {//tipos de imagem que aceito salvar
    const is_accepted =['image/png', 'image/jpg', 'image/jpeg']
    .find(accepted_format => accepted_format == file.mimetype)

    if(is_accepted){
        return cb(null, true)
    }
    return cb(null, false)
}

module.exports = multer({
    storage,
    file_filter
})
