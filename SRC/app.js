const express = require("express");
const connectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 4444;
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // post req- creating database

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

  try {
    await user.save();
    res.send("User Signed up successfully!");
  } catch (err) {
    res.status(400).send("Error signing up the user:" + err.message);
  }
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
    res.send(404).send("Something went wrong:");
  }
});
// get all USERS
app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.send(404).send("Something went wrong!");
  }
});

// get user by ID and delete

app.delete("/users", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    /* const user = await User.findByIdAndDelete( userId ); --> shorthand for above code and is acceptible accd to mongoose documentation*/
    res.send("deleted user!");
  } catch (err) {
    res.send(404).send("Something went wrong!");
  }
});

// update the existing user

app.patch("/users", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User is updated successfully!");
    console.log(updatedUser);
  } catch (err) {
    res.send(404).send("Something went wrong!");
  }
});

connectDatabase()
  .then(() => {
    console.log("DATABASE CONNECTION ESTABLISHED!");
    app.listen(port, () => {
      console.log("Server connected and listening on port:", port);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
