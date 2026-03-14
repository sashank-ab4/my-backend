// Authentication Route

const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signUp API
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, phoneNumber } = req.body;
  try {
    // validation of data
    validateSignUpData(req);
    // Encryption of data (the password)
    const encryptPassword = await bcrypt.hash(password, 10);

    // creating a new user model: easy and best modern way!
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptPassword,
      phoneNumber,
    }); // post req- creating database

    // creating a new instance of user model
    /*const user = new User({
    firstName: "Sashank",
    lastName: "Akkabattula",
    age: 25,
    emailId: "sashank@dev.com",
    nationality: "Indian", 
  }); 
  
  // this way's the sending data hardcoded!
  app.use(express.json()); and req.body helps sending data dynamically!
  */

    const newSignedInUser = await user.save();
    const token = jwt.sign({ _id: user._id }, "YekTerSec$44", {
      expiresIn: "1d",
    });

    // Adding the token to cookie and send the (required) response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });
    res.json({
      message: "Signed in successfully!",
      success: true,
      data: newSignedInUser,
    });
  } catch (err) {
    res.status(400).send("Error signing up the user:" + err.message);
  }
});
// login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Creating a JWT token for the user
      const token = jwt.sign({ _id: user._id }, "YekTerSec$44", {
        expiresIn: "1d",
      });

      // Adding the token to cookie and send the (required) response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error(" Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
// logout API

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("User Logged out Successfully!");
});
module.exports = authRouter;
