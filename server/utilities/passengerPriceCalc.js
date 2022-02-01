const passengerPriceCalc = (price) => {

        const splitPrice = price / 3

        const payoutCharge = (splitPrice / 0.9975) + 0.1

        const finalPrice = ((payoutCharge + 1) / 0.986) + 0.2

        console.log(Math.ceil(finalPrice * 100) / 100)

        return (
            Math.ceil(finalPrice * 100) / 100
        )

}

module.exports = passengerPriceCalc