//MÁSCARAS
const Mask ={
    apply(input , func ){
        setTimeout(function(){
            input.value = Mask[func](input.value)
        }, 1)
    },

    //DE PREÇO
    formatBRL(value){
        value = value.replace(/\D/g, "") //tira os digitos q sejam letras

        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value/100)
    },

    //CPF/CNPJ
    cpfCnpj(value){
        value = value.replace(/\D/g, "")

        //limite de 14 digitos
        if(value.length > 14){
            value = value.slice(0, -1)
        }
        
        //checar se é cpf ou cnpj
        
        if(value.length > 11){//CNPJ //11.222.333/4444-55
            
            //11.222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            
            //11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            //11.222.333/444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")

            //11.222.333/4444-55
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
        
        } else {
            //CPF 111.222.333-44

            //11.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            //11.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
        
            //11.222.333-44
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },

    cep(value){

        value = value.replace(/\D/g, "")

        if(value.length > 8){
            value = value.slice(0, -1)
        }
        
        //00000-000
        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}

//UPLOAD DE FOTOS

const Photos_Upload = {
    input: '',
    preview: document.querySelector(".photos_preview"),
    upload_limit: 6,
    files:[],

    handle_file_input(event){
        const {files: file_list} = event.target
        Photos_Upload.input = event.target

        if(Photos_Upload.limit(event)) {
            Photos_Upload.updateInputFiles()
            return
        }
        
/* Array.from(file_list).forEach(function(file){
    return file.name + "alo"

EXISTE UM JEITO DE FAZER FUNCION QUE SE CHAMA ARROW QUE FICA ASSIM

Array.from(file_list).forEach(file => 
file.name + "alo 

TIRO A FUNCTION DEIXO SO PARAMETRO, COLOCO A ARROW => E 
NÃO PRECISO DAS CHAVES NEM DO RETURN
)*/
    Array.from(file_list).forEach(file =>{

        Photos_Upload.files.push(file)

        const reader = new FileReader()//permite ler arquivos
        reader.onload = () =>{
            const image = new Image() //como se colocasse uma tag img no html
            image.src = String(reader.result)

            const div = Photos_Upload.get_container(image)

            Photos_Upload.preview.appendChild(div)
        }
        reader.readAsDataURL(file)
    })

    Photos_Upload.updateInputFiles()

    },

    limit(event){ //limitando numero de fotos
        const {upload_limit , input , preview} = Photos_Upload
        const {files: file_list} = input

        if(file_list.length > upload_limit){//se numero de arquivos for mais que o limite
            alert(`Envie no máximo ${upload_limit} fotos!`)
            event.preventDefault()//impede de enviar mais que o limite de fotos
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value =="photo"){
                photosDiv.push(item)
            }
        })

        const total_photos = file_list.length + photosDiv.length
        if(total_photos > upload_limit){
            alert("Você atingiu o limite máximo de fotos!")
            event.preventDefault()
            return true
        }
        return false
    },   


    get_all_files(){
        const data_transfer = new ClipboardEvent("").clipboardData || new DataTransfer() 
        //datatransfer funciona no google crhome
        //cliboard para firefox

        Photos_Upload.files.forEach(file => data_transfer.items.add(file))

        return data_transfer.files
    },

    get_container(image) {//cria div de imagem
        
        const div = document.createElement('div')
        
        div.classList.add('photo')
        
        div.onclick = Photos_Upload.remove_photo
        
        div.appendChild(image)

        div.appendChild(Photos_Upload.get_remove_button())

        return div
    },

    get_remove_button(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },

    remove_photo(event){
        const photo_div = event.target.parentNode //div class=photo
        const newFiles = Array.from(Photos_Upload.preview.children).filter(function(file){
            if (file.classList.contains('photo') && !file.getAttribute('id'))
            return true
        })

        const index = newFiles.indexOf(photo_div)
        Photos_Upload.files.splice(index , 1)
        //splice serve para remover uma posição de um array e 1 é remover um objeto
        Photos_Upload.updateInputFiles()

        photo_div.remove()
    },

    remove_old_photo(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removed_files = document.querySelector(" input[name='removed_files' ")
            if(removed_files){
                removed_files.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    },

    updateInputFiles(){
        Photos_Upload.input.files = Photos_Upload.get_all_files()
    }
}

const Image_Gallery ={

    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery_preview img'),

    set_image(e){
        const {target} = e

        Image_Gallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add("active")

        Image_Gallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox_target'),
    image: document.querySelector('.lightbox_target img'),
    close_button:  document.querySelector('.lightbox_target a.lightbox_close'),

    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.close_button.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.close_button.style.top = "-80px"
    }
}

const Validate ={
    apply(input , func ){

        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error)
            Validate.displayError(input, results.error)

    },

    displayError(input , error){
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },

    clearErrors(input){
        const errorDiv = input.parentNode.querySelector(".error")

        if(errorDiv){
            errorDiv.remove()
        }
    },

    //validação de email
    isEmail(value){
        let error = null
        
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat)){
            error = "E-mail inválido !"
        }

        return{
            error,
            value
        }
    },

    isCpfCnpj(value){
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if(cleanValues.length > 11 && cleanValues.length !== 14){
            error = "CNPJ incorreto !"
        }

        else if (cleanValues.length < 12 && cleanValues.length !== 11){
            error = "CPF incorreto !"
        }

        return{
            error,
            value
        }
    },

    isCep(value){
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if(cleanValues.length !== 8){
            error = "CEP inválido !"
        }

        return{
            error,
            value
        }
    },

    //Validação dos campos em branco
    allFields(e){
        const items = document.querySelectorAll('.item input, .item select, .item textarea')

        for (item of items){
            if(item.value == ""){
                const message = document.createElement('div')
                message.classList.add("messages")
                message.classList.add('error')
                message.style.position = 'fixed'
                message.innerHTML = "Por favor, preencha todos os campos!"
                document.querySelector('body').append(message)

                e.preventDefault()
            }
        }
    }
}

