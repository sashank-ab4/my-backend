const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  // this /profile API is secured and accessible omly after successfull LOGIN with valid credentials unless token is valid
  // now i want to validate my cookie (happens at server side)
  // validate my token
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Invalid Token!" + err.message);
  }
});

module.exports = profileRouter;
