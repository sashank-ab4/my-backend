const express = require("express");
const connectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 4444;
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

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
