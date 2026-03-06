const express = require("express");
const connectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 4444;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

// sign up API
app.post("/signup", async (req, res) => {
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

    await user.save();
    res.send("User Signed up successfully!");
  } catch (err) {
    res.status(400).send("Error signing up the user:" + err.message);
  }
});

// login API
app.post("/login", async (req, res) => {
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
      res.send("Logged in Successfully");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// get /profile API

app.get("/profile", userAuth, async (req, res) => {
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
// API for posting something but need authentication to access this tab/api
app.post("/postOnSocials", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + "wants to post on social media");
});

// get USER by EMAIL
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(404).send("Something went wrong:" + err.message);
  }
});
// get all USERS
app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.send(404).send("Something went wrong!" + err.message);
  }
});

// get user by ID and delete

app.delete("/users", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    /* const user = await User.findByIdAndDelete( userId ); --> shorthand for above code and is acceptible accd to mongoose documentation*/
    res.send("deleted user!");
    console.log(user);
  } catch (err) {
    res.send(404).send("Something went wrong!" + err.message);
  }
});

// update the existing user

app.patch("/users/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender"];
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdatesAllowed) {
      throw new Error("Updating this field is not allowed");
    }
    if (data?.skills.length > 5) {
      throw new Error("You cannnot add more than 5 skills!");
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User is updated successfully!");
    console.log(updatedUser);
  } catch (err) {
    res.status(404).send("Something went wrong!" + err.message);
  }
});

connectDatabase()
  .then(() => {
    console.log("DATABASE CONNECTION ESTABLISHED!");
    app.listen(port, () => {
      console.log("Server connected and listening to port:", port);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
