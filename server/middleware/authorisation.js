const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" })

module.exports = async (req, res, next) => {

    // add an if check using decode()

    // refresh the jwt token if it is close to the expiration!, 
    // this way when closing the app, it will log the user out but if using it consistently it wont. 

    const JWTtoken = req.header("token");

    // const decodedJWT = jwt.decode(JWTtoken);

    if (!JWTtoken) {
        return res.status(403).json("not authorised")
    }

    try {


        const payload = jwt.verify(JWTtoken, process.env.JWTsecret);

        req.user = payload.user

        next();
    } catch (err) {
        // deal with the error in the catch block here?

        console.error(err.message);
        return res.status(403).json("not authorised");

    }
};

// status 403 not authenticated

// status 401 not authorised