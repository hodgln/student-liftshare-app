const router = require("express").Router();
require('dotenv').config({ path: "../.env" });
const pool = require("../db");
const bcrypt = require("bcrypt");
const JWTgen = require("../utilities/JWTgen");
const JWTrefresh = require("../utilities/JWTrefresh");
const EmailOTPgen = require("../utilities/EmailOTPgen");
const jwt = require('jsonwebtoken');
const validateInfo = require("../middleware/validateInfo")
const authorisation = require("../middleware/authorisation");
const cloudinary = require('cloudinary');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: "profilepics/" });



// add in the validateInfo function below

router.post("/register", upload.single('photo'), async (req, res) => {
    try {

        const { firstname, surname, email, password, category, phoneNumber } = JSON.parse(req.body.data)

        // check if user exists and if already exists then throw error

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


        // post photo to cloudinary - can use secure_url instead of url

        const cloudinaryRes = await cloudinary.v2.uploader.upload(req.file.path);

        // post refresh token to db 

        
        const newUser = await pool.query("INSERT INTO Users (user_firstname, user_surname, user_email, user_password, user_account, phone_number, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
            firstname, surname, email, bcryptPassword, category, phoneNumber, cloudinaryRes.url
        ]);

        // 'confirmed' is automatically false here! - (change value to 'default = false' in db)
        if (newUser.rows.length !== 0) {
            await pool.query("INSERT INTO Confirmations (user_id, code) VALUES ($1, $2) RETURNING *", [
                newUser.rows[0].user_id, bcryptOTP
            ]);
        };

        // create and post refresh token

        const refreshToken = JWTrefresh(newUser.rows[0].user_id)

        await pool.query("UPDATE Users SET refresh_token = $1 WHERE user_id = $2 RETURNING *", [
            refreshToken, newUser.rows[0].user_id
        ]);


        const token = JWTgen(newUser.rows[0].user_id);

        // add in a refresh token and put in response


        res.json({ token });


    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});

router.put("/changepic", authorisation, upload.single('newpic'), async (req, res) => {
    try {

        const cloudinaryRes = await cloudinary.v2.uploader.upload(req.file.path);

        const changePic = await pool.query("UPDATE Users SET profile_picture = $1 WHERE user_id = $2 RETURNING profile_picture", [
            cloudinaryRes.url, req.user.id
        ]);

        res.json(changePic.rows[0].profile_picture)
        
    } catch (error) {
        console.log(error.message)
    }
});

router.put("/changephone/:newPhone", authorisation, async (req, res) => {
    try {

        const { newPhone } = req.params

        const changephone = await pool.query("UPDATE Users SET phone_number = $1 WHERE user_id = $2 RETURNING phone_number", [
            newPhone, req.user.id
        ]);

        res.json(changephone.rows[0].phone_number)
        
    } catch (error) {
        console.log(error.message)
    }
});


router.post("/login", validateInfo, async (req, res) => {
    try {



        const { email, password, category } = req.body


        // check if user doesnt exist (if not then we throw error)

        const user = await pool.query("SELECT * FROM Users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {

            return res.status(401).json("Password or Email incorrect");
        }

        // check if incoming password is same as db password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)

        if (!validPassword) {

            return res.status(401).json("Password or Email incorrect");
        };

        // check if account is the right one

        if (category != user.rows[0].user_account) {

            return res.status(401).json(`Please log in to your ${user.rows[0].user_account} account`)
        };

        const refreshToken = JWTrefresh(user.rows[0].user_id)

        await pool.query("UPDATE Users SET refresh_token = $1 WHERE user_id = $2 RETURNING *", [
            refreshToken, user.rows[0].user_id
        ]);

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

router.post("/verified", async (req, res) => {
    try {

        // find a way to get user_id up

        // decode an expired token?

        const token = req.body.refresh

        const decodedJWT = jwt.decode(token)

        const getRefresh = await pool.query("SELECT refresh_token, user_account FROM Users Where user_id = $1", [
            decodedJWT.user.id
        ]);

        const result = jwt.verify(getRefresh.rows[0].refresh_token, process.env.JWTrefresh)

        const newToken = JWTgen(result.user.id)

        res.json({
            token: newToken,
            category: getRefresh.rows[0].user_account
        });

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
