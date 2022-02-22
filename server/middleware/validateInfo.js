module.exports = function(req, res, next) {
    // this is not working because it is multiform
    const { firstname, surname, email, password } = req.body
  
    function validEmail(userEmail) {
      //return /^[\w]+[\w.%+-]*@[\w.-]+\.ac\.uk$/.test(userEmail);
      return userEmail
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![firstname, surname, email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      }
    }
  
    next();
  };