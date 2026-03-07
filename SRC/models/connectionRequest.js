const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      // fromUserId
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverUserId: {
      //toUserId
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
