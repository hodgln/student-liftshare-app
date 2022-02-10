const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const bcrypt = require("bcrypt");
const EmailOTPgen = require("../utilities/EmailOTPgen");
const moment = require('moment')


router.get("/:code", authorisation, async (req, res) => {
    try {
        const { code } = req.params

        const date = new Date();

        const fiveMinsAgo = moment(date).subtract(5, 'm').toDate();

        //select confrimation_code and created_at from...

        console.log(fiveMinsAgo)

        console.log(date)

        
        const bcryptOTP = await pool.query("SELECT code, created_at FROM Confirmations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [
            req.user.id
        ]);

        // console.log(`user id is ${req.user.id}`)

        //use moment.js for this!!!!!

        //console.log(bcryptOTP.rows[0].created_at)

        // if(bcryptOTP.rows[0].created_at < fiveMinsAgo) {
        //     res.json("Your code has expired, please click here to resend code")
        //     //EmailOTPgen()
        // } 

        const correctCode = await bcrypt.compare(code, bcryptOTP.rows[0].code);



        if (!correctCode) {
            
            res.json({title: "Incorrect code", body: "please press here to resend code"})
        } else if (bcryptOTP.rows[0].created_at < fiveMinsAgo) {
            
            res.json({title: "Your code has expired", body: "please click here to resend code"})
        } else {
            const confirm = await pool.query("UPDATE Users SET confirmed = $1 WHERE user_id = $2 RETURNING *", [
                true, req.user.id
            ]);
            


            res.json(confirm.rows[0].confirmed)
        }
    } catch (error) {
        console.log(error.message)
    }
});

router.get('/reset/:code/:email', async (req, res) => {
    try {
        const { code, email } = req.params

        
        const userID = await pool.query("SELECT user_id FROM Users where user_email = $1", [
            email
        ])

        const date = new Date();

        const fiveMinsAgo = moment(date).subtract(5, 'm').toDate();


        const bcryptOTP = await pool.query("SELECT code, created_at FROM Confirmations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [
            userID.rows[0].user_id
        ]);

        const correctCode = await bcrypt.compare(code, bcryptOTP.rows[0].code);


        if (!correctCode) {
            
            res.json({title: "Incorrect code", body: "please press here to resend code"})
            
        } else if (bcryptOTP.rows[0].created_at < fiveMinsAgo) {
            
            res.json({title: "Your code has expired", body: "please click here to resend code"})
            
        } else {
            
            res.json(true)
            
        }


    } catch (error) {
        console.log(error.message)
    }

})

router.post("/email/:email", authorisation, async (req, res) => {
    try {
        //send email and update confirmation code in db

        const { email } = req.params

        

        console.log(email)

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);


        const OTP = EmailOTPgen(email)

        const bcryptOTP = await bcrypt.hash(JSON.stringify(OTP), salt);

        console.log(bcryptOTP)

        

        const insertConfirmation = await pool.query("INSERT INTO Confirmations (user_id, code) VALUES ($1, $2) RETURNING *", [
            req.user.id, bcryptOTP
        ]);


        
        res.json(insertConfirmation)



    } catch (error) {
        console.log(error.message)
    }
})


router.post("/email/reset/:email",  async (req, res) => {
    try {
        //send email and update confirmation code in db

        const { email } = req.params

        
        const userID = await pool.query("SELECT user_id FROM Users where user_email = $1", [
            email
        ])

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);


        
        

        if(userID.rows.length === 0) {
            

            res.json("This email is not associated with an account")
            
        } else {

            const OTP = EmailOTPgen(email)

            const bcryptOTP = await bcrypt.hash(JSON.stringify(OTP), salt);    

            await pool.query("INSERT INTO Confirmations (user_id, code) VALUES ($1, $2) RETURNING *", [
                userID.rows[0].user_id, bcryptOTP
            ]);

            

            res.json("sent")
        }



    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router