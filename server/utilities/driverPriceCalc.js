const driverPriceCalc = (price, passengers) => {

    const priceDiv = price / 3

    if(passengers === 1) {
        

        const minusOne = priceDiv - 1


        return(
            Math.floor(minusOne * 100) / 100
        )
    } else if(passengers === 2) {

        const firstPrice = priceDiv * 2

        return(
            Math.floor(firstPrice * 100) / 100
        )
    } else if(passengers === 3) {

        return(
            price
        )
    } else {
        return(console.log("invalid passenger number"))
    }

    
}

module.exports = driverPriceCalc;