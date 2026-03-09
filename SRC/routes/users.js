// userRouter

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
// get all the PENDING connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      receiverUserId: loggedInUser._id,
      status: "interested",
    }).populate("senderUserId", [
      "firstName, lastName",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ]);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { receiverUserId: loggedInUser._id, status: "accepted" },
        { senderUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("senderUserId", "firstName lastName age about skills gender");

    const data = connectionRequests.map((row) => row.senderUserId);
    res.send("showing connections").json({ data });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
module.exports = userRouter;
