const express = require("express");
const { Chat } = require("../models/chats");
const textsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

textsRouter.get("/chat/:textingUserId", userAuth, async (req, res) => {
  const { textingUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, textingUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
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

module.exports = textsRouter;
