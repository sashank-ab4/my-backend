const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // read the token from requested cookies
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("You are logged out, please log in!");
    }
    const decodedObject = jwt.verify(token, "YekTerSec$44");

    const { _id } = decodedObject;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("User not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }

  // validate that token
  // find the user and send the required user as response
};

module.exports = { userAuth };
