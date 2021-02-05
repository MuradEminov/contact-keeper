const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token"); // x-auth-token header should exist

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" }); // no token is available
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); //take the jwt payload with user data from jwt

    req.user = decoded.user; // assign the payload to request object as user property
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" }); // if not verified => token is not valid
  }
};
