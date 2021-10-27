const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" })

module.exports = async (req, res, next) => {
    try {

        const JWTtoken = req.header("token");
        if(!JWTtoken) {
            return res.status(403).json("not authorised")
        }

        const payload = jwt.verify(JWTtoken, process.env.JWTsecret);

        req.user = payload.user
    
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("not authorised");
         
    }
};

// status 403 not authenticated

// status 401 not authorised