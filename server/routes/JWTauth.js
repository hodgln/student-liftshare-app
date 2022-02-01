const router = require("express").Router();
require('dotenv').config({ path: "../.env" });
const pool = require("../db");
const bcrypt = require("bcrypt");
const JWTgen = require("../utilities/JWTgen");
const EmailOTPgen = require("../utilities/EmailOTPgen");
const jwt = require('jsonwebtoken');
const validateInfo = require("../middleware/validateInfo")
const authorisation = require("../middleware/authorisation");

// register

router.post("/register", validateInfo, async (req, res) => {
    try {

        // destructure req.body

        const { firstname, surname, email, password, category, phoneNumber, picture } = req.body

        // check if user exists and if already exists then throw error

        console.log(email, password, phoneNumber)

        const user = await pool.query("SELECT * FROM Users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length !== 0) {
            return res.json("User already exists");
        };

        // bcrypt user password

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPassword = await bcrypt.hash(password, salt);

        const OTP = EmailOTPgen(email)

        const bcryptOTP = await bcrypt.hash(JSON.stringify(OTP), salt);

        console.log(bcryptOTP)


        // enter new user 

        const newUser = await pool.query("INSERT INTO Users (user_firstname, user_surname, user_email, user_password, user_account, phone_number, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
            firstname, surname, email, bcryptPassword, category, phoneNumber, picture
        ]);

        // 'confirmed' is automatically false here! - (change value to 'default = false' in db)
        if (newUser.rows.length !== 0) {
            await pool.query("INSERT INTO Confirmations (user_id, code) VALUES ($1, $2) RETURNING *", [
                newUser.rows[0].user_id, bcryptOTP
            ]);
        };

        

        const token = JWTgen(newUser.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});


router.post("/login", validateInfo, async (req, res) => {
    try {

        //destructure req.body

        const { email, password, category } = req.body

        // check if user doesnt exist (if not then we throw error)

        const user = await pool.query("SELECT * FROM Users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email incorrect");
        }

        console.log(user.rows.length)

        // check if incoming password is same as db password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)

        if (!validPassword) {
            return res.status(401).json("Password or Email incorrect");
        };

        // check if account is the right one

        if (category != user.rows[0].user_account) {
            return res.status(401).json(`Please log in to your ${user.rows[0].user_account} account`)
        };

        //check if user is confirmed

        // hand out jwt token

        const token = JWTgen(user.rows[0].user_id);

        //this will properly work once there is a default value for confirmed users, only propery use this feature on release

        //set below to true to pass the confirmation stage in logging in.

        res.json({ token: token, confirmed: user.rows[0].confirmed || false, category: user.rows[0].user_account });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});

router.get("/verified", authorisation, async (req, res) => {
    try {

        res.json(true)

    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }

});

router.put("/resetpassword", async (req, res) => {
    try {
        
        const { email, password } = req.body


        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPassword = await bcrypt.hash(password, salt);


        const updatePassword = await pool.query(
            "UPDATE Users SET user_password = $1 WHERE user_email = $2 RETURNING *", [
            bcryptPassword, email
        ]);

        //split into two separate queries

        if (updatePassword.rows.length === 0) {
            return res.json('could not update password')
        };

        res.json(updatePassword);

        //console.log(decrementSeats.rows)

    } catch (error) {
        console.log(error.message);
    }
});

router.put("/pushToken", authorisation, async (req, res) => {
    try {

        // destructure req.body

        const { pushToken } = req.body

        // check if user exists and if already exists then throw error

        console.log("hello")

        const putToken = await pool.query("UPDATE Users SET push_token = $1 WHERE user_id = $2", [
            pushToken, req.user.id
        ]);

        
        res.json(putToken)
       

    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;
