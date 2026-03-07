const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  //data sanitization
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Editing this field is not allowed!");
    }
    const data = req.body;
    if (data?.skills.length > 5) {
      throw new Error("You can not add more than 5 skills!");
    }
    const loggedInUser = req.user;
    /*  console.log(loggedInUser); */
    // gives the data of user who's logged in and wanna do edit thier profile
    Object.keys(data).forEach((key) => (loggedInUser[key] = data[key]));
    /* console.log(loggedInUser); */
    // this now gives the values, keys, fields that are UPDATED by loggedin user and shows in console as we are console.logging!
    await loggedInUser.save();
    // save this updated/edited data into DB
    res.send(`${loggedInUser.firstName}, your profile is updated successfully`);
  } catch (err) {
    res
      .status(401)
      .send("You cannot edit this particular field!" + err.message);
  }
});

module.exports = profileRouter;
