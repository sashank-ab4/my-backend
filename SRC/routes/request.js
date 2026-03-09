const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// API for posting something but need authentication to access this tab/api
requestRouter.post(
  "/request/send/:status/:receiverUserId",
  userAuth,
  async (req, res) => {
    try {
      const senderUserId = req.user._id;
      const receiverUserId = req.params.receiverUserId;
      const status = req.params.status;
      // logics for:
      // only two statuses are allowed and if one manually enters others statuses like-accepted/rejected - throw's error!
      const onlyAllowedStatus = ["interested", "ignored"];
      if (!onlyAllowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type:" + status });
      }

      // cannot send request (interested/ignored) to any non existing user ID in our database, avoids and throws error in such corner cases!
      const toUser = await User.findById(receiverUserId);
      if (!toUser) {
        return res.send(404).json({ message: "User not found!" });
      }

      // cannot send the request to oneself (you cannot send request(interested/ignored) to yourself), avoids and throws error in such corner cases!
      if (senderUserId.equals(receiverUserId)) {
        return res
          .status(400)
          .json({ message: "You cannnot send request to yourself!" });
      }
      // can send the request to anyone only ONE time, can't send multiple request to same person/id, avoids and throws error in such corner cases!
      const connectionRequestExists = await ConnectionRequest.findOne({
        $or: [
          { senderUserId, receiverUserId },
          { senderUserId: receiverUserId, receiverUserId: senderUserId },
        ],
      });
      if (connectionRequestExists) {
        return res.status(400).send("Connection request already exists!");
      }

      const connectionRequest = new ConnectionRequest({
        senderUserId,
        receiverUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " has shown " +
          status +
          " in " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(401).send("ERROR:" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      /* KEY CHECKS */
      // validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type:" + status });
      }
      // Sam John ==> Aegon
      // status = only if interested
      // requestId should be valid : (meaning should be in DB)
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request is not valid" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Your connection is " + status, data });
    } catch (err) {
      res.status(401).send("ERROR:" + err.message);
    }
  },
);

module.exports = requestRouter;
