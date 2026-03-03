const express = require("express");
const app = express();
const port = 4444;

app.get("/user", (req, res) => {
  res.send({ firstName: "Sashank", lastName: "AB" });
});
app.post("/user", (req, res) => {
  res.send("Data is saved successfully!");
});
app.delete("/user", (req, res) => {
  res.send("Data is deleted successfully!");
});
app.use((req, res) => {
  res.send("Hi from the server!");
});

app.listen(port, () => {
  console.log("Server connected and listening on port..", port);
});
