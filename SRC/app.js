const express = require("express");

const app = express();
const port = 3000;
app.use((req, res) => {
  res.send("Hi from servers!");
});

app.use("/dash", (req, res) => {
  res.send("this is dashboard!");
});

app.listen(port, () => {
  console.log("Serve connected and listening on port..", port);
});
