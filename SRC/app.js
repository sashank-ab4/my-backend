const express = require("express");
const connectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 4444;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
    res.send("User data  is updated successfully!");
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
    console.error("Database cannot be connected " + err.message);
  });
