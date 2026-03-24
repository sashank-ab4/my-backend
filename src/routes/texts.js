const express = require("express");
const { Chat } = require("../models/chats");
const textsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

textsRouter.get("/chat/:textingUserId", userAuth, async (req, res) => {
  const { textingUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, textingUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, textingUserId],
        messages: [],
      });

      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.error("ERROR: " + error.message);
  }
});

textsRouter.get("/user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "firstName lastName photoUrl",
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Something went Wrong!" });
  }
});
module.exports = textsRouter;
