const router = require("express").Router();
require('dotenv').config({ path: "../.env" });
const pool = require("../db");
const bcrypt = require("bcrypt");
const JWTgen = require("../utilities/JWTgen");
const EmailOTPgen = require("../utilities/EmailOTPgen");
const jwt = require('jsonwebtoken');
const validateInfo = require("../middleware/validateInfo")
const authorisation = require("../middleware/authorisation");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: "profilepics/" })



// router.post('/uploadphoto', upload.single('photo'), function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any

//     // launch this route in an async function before launching /register. 

//     // delete the photo from files in /register
// });

router.post("/register", upload.single('photo'), async (req, res) => {
    try {

        // destructure req.body

        console.log(req.file);//this will be automatically set by multer
        console.log(req.body);
        //below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
        fs.readFile(req.file.path, (err, contents) => {
            if (err) {
                console.log('Error: ', err);
            } else {
                console.log('File contents ', contents);
            }
        });

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

        // upload photo to cloudinary

        // upload photo to local file /uploads in server using multer, 

        // then use that directory for profile pic upload


        const cloudinaryFunc = async() => {
            try {
                await cloudinary.uploader.upload(req.file.path, (error, result) => {
                    console.log(error, result)
                });
            } catch (error) {
                console.log(error.message)
            }
        }

        
        await cloudinaryFunc()

        // console.log(`imageID is ${imageID}`)

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
