const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chats");
const User = require("../models/user");
const secretRoomId = (userId, textingUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, textingUserId].sort().join("__"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, textingUserId }) => {
      const roomId = secretRoomId(userId, textingUserId);

      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ userId, textingUserId, text }) => {
      try {
        const roomId = secretRoomId(userId, textingUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, textingUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, textingUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });
        await chat.save();
        const user = await User.findById(userId).select(
          "firstName lastName photoUrl",
        );
        const lastMessage = chat.messages[chat.messages.length - 1];
        io.to(roomId).emit("messageReceived", {
          ...lastMessage.toObject(),
          senderId: {
            _id: userId,
            ...user.toObject(),
          },
        });
      } catch (err) {
        console.error("Error: " + err.message);
      }
    });
  });
};

module.exports = initializeSocket;
