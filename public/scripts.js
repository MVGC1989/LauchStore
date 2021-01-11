// Máscara de preço

/* jeito 01

const input = document.querySelector("input[name='price']")

input.addEventListener("keydown", function(event){
    
    setTimeout(function(){
        let {value} = event.target

        value = value.replace(/\D/g, "")

        value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value/100)

        event.target.value = value
    }, 1 )
}) */

// Jeito 2 mais funcional pois é dinamico e aceita outras funçoes rodando junto

const Mask ={
    apply(input , func ){
        setTimeout(function(){
            input.value = Mask[func](input.value)
        }, 1)
    },

    formatBRL(value){
        value = value.replace(/\D/g, "") //tira os digitos q sejam letras

        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value/100)
    }
}

//Upload de fotos

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