const socket = require("socket.io");
const crypto = require("crypto");
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

    socket.on("sendMessage", ({ firstName, userId, textingUserId, text }) => {
      const roomId = secretRoomId(userId, textingUserId);
      console.log(firstName + ":" + text);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });
  });
};

module.exports = initializeSocket;
