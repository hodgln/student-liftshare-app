const router = require("express").Router();
require("dotenv").config({ path: "../.env" })
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const driverPriceCalc = require("../utilities/driverPriceCalc");
const notificationSender = require("../utilities/notificationSender");
const stripe = require("stripe")(process.env.stripesecret);

//NEEDS A SYSTEM REVIEW

//USE STRIPE CONNECT - EXPRESS ACCOUNTS AND MANUAL PAYOUTS


// - business url is the spareseat url
// - merchant code is chosen by platform
// provide both of these beforehand and the express account should be minimal details

router.post("/expressaccount", async (req, res) => { //add in authorisation here!!
    try {

        //test standard to see if you can prefill everything apart from what is required in express

        const { firstname, surname, link } = req.body

        

        const account = await stripe.accounts.create({
            type: 'express',
            capabilities: {
                transfers: { requested: true },
            },
            business_type: 'individual',
            business_profile: {
                product_description: 'A driver who gives lifts to passengers',
                // url: 'http://localhost:8081' 
            },
            individual: {
                first_name: firstname,
                last_name: surname,
                // dob: {
                //     day: day,
                //     month: month,
                //     year: year
                // },
                // address: {
                //     line1: line1,
                //     postal_code: postal_code,
                //     city: city
                // }
            }
        });



        // Your refresh_url should trigger a method on your server to call Account Links again 
        
        // with the same parameters and redirect the user to the Connect Onboarding flow to create a seamless experience.


        const accountLink = await stripe.accountLinks.create({
            account: account.id, // account data from above!!
            refresh_url: 'https://example.com/reauth',
            return_url: link,
            type: 'account_onboarding',
        });



        // res.json(accountLink)

        res.json({
           link: accountLink.url,
           id: account.id
        })

    } catch (error) {
        console.log(error.message)
    }
})

//routes to handle the refresh and return urls

// return: 

router.get("/returnurl/:accID", authorisation, async (req, res) => {
    try {

        const { accID } = req.params

        console.log(accID)

        const account = await stripe.accounts.retrieve(
            accID
        );

        console.log(`the acc id is ${account.id}`)

        if(account.tos_acceptance.date !== null) {
            const update = await pool.query("UPDATE Users SET stripe_id = $1 WHERE user_id = $2", [
                account.id, req.user.id
            ]);

            console.log(update.rows[0])
            res.json("success")
        } else {
            res.json("failure")
        }

    } catch (error) {
        console.log(error.message)
    }
})
// const account = await stripe.accounts.retrieve(
//     'acct_1IxqKxDSswVkzYl6'
//   );
// if accounts.validated (or similar) is true, then post account number to database


//refresh:
// should call accountsApi again with the same parameters


// add in an 'access stripe dashboard' from the profile


router.post("/paydriver/:liftshare_id", authorisation, async (req, res) => {
    try {
        //send up liftshare_id and use that to get the stripe account of the driver and the driverprice

        const { liftshare_id, scannedPassengers } = req.body

        const userInfo = await pool.query(
            `SELECT
            l.driverprice,
            u.stripe_id
            FROM Liftshares as l 
            INNER JOIN Users as u ON l.user_id = u.user_id
            WHERE l.liftshare_id = $1`, [
            liftshare_id
        ]);

        const price = driverPriceCalc(userInfo.rows[0].driverprice, scannedPassengers.length)                  

        // Create a Transfer to the connected account (later):
        const transfer = await stripe.transfers.create({
            amount: price * 100,
            currency: 'gbp',
            destination: 'acct_1KGLnURWqrJHuYoi', //userInfo.rows[0].stripe_id,
            transfer_group: `{LIFT${liftshare_id}}`
        });

        console.log(transfer)

        res.json(transfer)

    } catch (error) {
        console.log(error.message)
    }
})

router.post("/checkout/:id", authorisation, async (req, res) => {




    // register apple merchant

    try {
        const { id } = req.params


        const price = await pool.query(`SELECT passengerprice FROM Liftshares WHERE liftshare_id = $1`, [
            id
        ]);


        const stripeID = await pool.query(`SELECT stripe_id FROM Users WHERE user_id = $1`, [
            req.user.id
        ]);


        const amount = Math.round(price.rows[0].passengerprice * 100)

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
                transfer_group: `{LIFT${id}}`,
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
                transfer_group: `{LIFT${id}}`,
                capture_method: 'manual'
                // expires after 3 days? add timestamp to requests
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



router.post("/capture", authorisation, async (req, res) => {
    try {

        const { request_id } = req.body

        const paymentIntentID = await pool.query("SELECT payment_intent_id FROM Requests WHERE request_id = $1", [
            request_id
        ])

        const capture = await stripe.paymentIntents.capture(
            paymentIntentID.rows[0].payment_intent_id
        )

        // amount to capture is not necessary

        //res.json capture success code?

        res.json(capture)

    } catch (error) {
        console.log(error.message)
    }
})

router.delete("/cancel/:requestid", authorisation, async (req, res) => {
    try {

        const { requestid } = req.params

        const paymentIntentID = await pool.query("SELECT payment_intent_id FROM Requests WHERE request_id = $1", [
            requestid
        ]);


        const cancel = await stripe.paymentIntents.cancel(
            paymentIntentID.rows[0].payment_intent_id
        );

        //success code?

        res.json(cancel)

    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router;