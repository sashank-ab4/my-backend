const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chats");
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
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ firstName, userId, textingUserId }) => {
      const roomId = secretRoomId(userId, textingUserId);
      console.log(firstName + "joined room: " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, textingUserId, text }) => {
        try {
          const roomId = secretRoomId(userId, textingUserId);
          console.log(firstName + ":" + text);

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
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.error("Error: " + err.message);
        }
      },
    );
  });
};

module.exports = initializeSocket;
