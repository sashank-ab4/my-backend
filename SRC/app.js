const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
const port = 4444;

/* app.get("/user", (req, res) => {
  res.send({ firstName: "Sashank", lastName: "AB" });
}); */

/* app.get("/user/:userId/:name", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Samuel", lastName: "John" });
}); */

/* app.post("/user", (req, res) => {
  res.send("Data is saved successfully!");
});
app.delete("/user", (req, res) => {
  res.send("Data is deleted successfully!");
});
app.use((req, res) => {
  res.send("Hi from the server!");
}); */

//app.use('/first', [rh, rh1, rh2],[ rh3,rh4],rh5) --> wrapping route handlers in arrays- works fine

app.use("/admin", adminAuth);

app.post("/user/login", userAuth, (req, res) => {
  res.send("User logged in successfully!");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Here is your data!");
});

app.listen(port, () => {
  console.log("Server connected and listening on port..", port);
});
