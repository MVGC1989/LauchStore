module.exports = {
date(timestamp){
    const date = new Date(timestamp)
    
    const year = date.getFullYear() 
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
        return {
            day,
            month,
            year,
            hour,
            minutes,
            seconds,
            iso: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
            birth_day: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
},

    formatPrice(price){
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(price/100)
    }
}