const jwt = require("jsonwebtoken");
require('dotenv').config({ path: "../.env" });


const JWTrefresh = (user_id) => {
    const payload = {
        user: {
            id: user_id.replace(/"/g, "'")
    }
}

    return jwt.sign(payload, process.env.JWTrefresh, {expiresIn: "1y"})
};

module.exports = JWTrefresh;