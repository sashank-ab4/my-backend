const express = require("express");
const connectDatabase = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 4444;
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users");
const initializeSocket = require("./utils/socket");
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

const server = http.createServer(app);
initializeSocket(server);

connectDatabase()
  .then(() => {
    console.log("DATABASE CONNECTION ESTABLISHED!");
    server.listen(port, () => {
      console.log("Server connected and listening to port:", port);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected " + err.message);
  });
