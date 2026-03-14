// userRouter

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const VISBILE_DATA = "_id firstName lastName age about skills gender photoUrl";
// get all the PENDING connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      receiverUserId: loggedInUser._id,
      status: "interested",
    }).populate("senderUserId", VISBILE_DATA);
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
    })
      .populate("senderUserId", VISBILE_DATA)
      .populate("receiverUserId", VISBILE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.senderUserId._id.toString() === loggedInUser._id.toString()) {
        return row.receiverUserId;
      }
      return row.senderUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // feed is where logged in user get all the users he wants to show interest,ignore,accept,reject
    // logged in user should see all the user cards except
    // 1. his own card
    // 2. already "interested" cards
    // 3. loggedIn user's ignored cards
    // 4. loggedIn user's accepted connections
    const loggedInUser = req.user;
    // pagination logic
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    //data sanitization preventing users asking limit more than anything
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // find all the connection requests (sent and received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { senderUserId: loggedInUser._id },
        { receiverUserId: loggedInUser._id },
      ],
    }).select("senderUserId receiverUserId");

    const usersShouldNotBeInFeed = new Set();
    connectionRequests.forEach((req) => {
      usersShouldNotBeInFeed.add(req.senderUserId.toString());
      usersShouldNotBeInFeed.add(req.receiverUserId.toString());
    });
    // DB Query 1. users not in the restricted array, 2. same loggedIn user
    const usersShouldBeInFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(usersShouldNotBeInFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(VISBILE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Core Feed",
      success: true,
      count: usersShouldBeInFeed.length,
      data: usersShouldBeInFeed,
    });
  } catch (err) {
    res.status(401).send("Unable to load the feed " + err.message);
  }
});
module.exports = userRouter;
