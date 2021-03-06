const jwt = require("jsonwebtoken");
require('dotenv').config({ path: "../.env" });


const JWTgen = (user_id) => {
    const payload = {
        user: {
            id: user_id.replace(/"/g, "'")
    }
}

    return jwt.sign(payload, process.env.JWTsecret, {expiresIn: "5min"})
};

module.exports = JWTgen;
