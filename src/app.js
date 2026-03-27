const express = require("express");
const connectDatabase = require("./config/database");

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
const textsRouter = require("./routes/texts.js");
const initializeSocket = require("./utils/socket.js");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://www.devtribe.online",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", textsRouter);

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
