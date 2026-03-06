const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// API for posting something but need authentication to access this tab/api
requestRouter.post("/postOnSocials", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + "wants to post on social media");
});

module.exports = requestRouter;
