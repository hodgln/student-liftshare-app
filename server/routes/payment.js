const router = require("express").Router();
require("dotenv").config({ path: "../.env" })
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const stripe = require("stripe")(process.env.stripesecret)


//NEEDS A SYSTEM REVIEW

router.post("/checkout/:id", authorisation, async (req, res) => {


    const amountHandler = (price, count) => {
        if (count !== '0') {
            return (parseInt((((price / ((+count) + 1)) + 0.5) * 100)))
        } else {
            return (
                parseInt(((price + 0.5) * 100))
            )
        }
    }

    // register apple merchant

    try {
        const { id } = req.params

        const price = await pool.query(`SELECT driverprice FROM Liftshares WHERE liftshare_id = $1`, [
            id
        ]);

        const count = await pool.query(`SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = $1`, [
            id
        ]);


        const stripeID = await pool.query(`SELECT stripe_id FROM Users WHERE user_id = $1`, [
            req.user.id
        ]);

        console.log(stripeID.rows[0].stripe_id)


        const amount = amountHandler(price.rows[0].driverprice, count.rows[0].count);

        // const customer = await stripe.customers.create() //stripeID ? await stripe.customer.retrieve(stripeID) : await stripe.customers.create().then(pool.query(`INSERT INTO Users (stripe_id) VALUES($1) WHERE user_id = $2`, [customer.id, req.user.id]))

        //pricing needs fixing - if there is a confirmed request the price should automatically decrease on stripe

        if (stripeID.rows[0].stripe_id) {

            const customer = await stripe.customers.retrieve(stripeID.rows[0].stripe_id);

            console.log(`legit route`)

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2020-08-27' }
            )
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'gbp',
                customer: customer.id,
                payment_method_types: ['card'],
                capture_method: 'manual'
            });
            res.json({
                paymentIntent: paymentIntent,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id
            });
            //console.log(paymentIntent.id)
            // pool.query(` UPDATE Requests SET payment_intent_id = $1 WHERE user_id = $2 AND liftshare_id = $3`, [
            //     paymentIntent.id, req.user.id, id
            // ]);
        } else {
            const customer = await stripe.customers.create()

            console.log(customer)

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2020-08-27' }
            )
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'gbp',
                customer: customer.id,
                payment_method_types: ['card'],
                capture_method: 'manual'
            });
            res.json({
                paymentIntent: paymentIntent,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id
            })
            pool.query(`UPDATE Users SET stripe_id = $1 WHERE user_id = $2`, [customer.id, req.user.id]);
            // pool.query(` UPDATE Requests SET payment_intent_id = $1 WHERE user_id = $2 AND liftshare_id = $3`, [
            //     paymentIntent.id, req.user.id, id
            // ]);
            //post paymentIntent id
        }

    } catch (error) {
        console.log(error.message)
    }

});

//add in logic for 'capture the funds step 2'

router.post("/checkout/capture/:id", authorisation, async(req, res) => {


    const amountHandler = (price, count) => {
        if (count !== '0') {
            return (parseInt((((price / count) + 0.5) * 100)))
        } else {
            return (
                parseInt(((price + 0.5) * 100))
            )
        }
    }


    try {
        const { id } = req.params

        const { idsArray } = req.body

        //check if this logic works by providing the QR array from scratch - not from the QR

        //make sure same format (parsed or stringified)

        const price = await pool.query(`SELECT driverprice FROM Liftshares WHERE liftshare_id = $1`, [
            id
        ]);

        const count = await pool.query(`SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = $1`, [
            id
        ]);


        // const stripeID = await pool.query(`SELECT stripe_id FROM Users WHERE user_id = $1`, [
        //     req.user.id
        // ]);

        const paymentID = await pool.query(`SELECT payment_intent_id FROM Requests WHERE user_id = $1 AND liftshare_id = $2`, [
            req.user.id, id
        ]);

        //retrieve payment intent id and put into capture request

        console.log(paymentID.rows[0].payment_intent_id)


        const amount = amountHandler(price.rows[0].driverprice, count.rows[0].count);

        console.log(amount)



        //you need to put in the transaction id here, not the customer id, maybe save this to the request?
        const intent = await stripe.paymentIntents.capture(
            paymentID.rows[0].payment_intent_id, {
            amount_to_capture: amount,
        });

        console.log(req.user.id);

        console.log(idsArray);

        if (idsArray.includes(req.user.id)) {
            res.json(intent)
        } else {
            res.json("you are not booked onto this lift")
        }

        //this logic works - fix stripe end and response.json()

    } catch (error) {
        console.log(error.message)
    };

});


module.exports = router;