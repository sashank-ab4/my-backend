// this is "User" schema!

const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email structure is invalid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not matching the strong criteria:" + value,
          );
        }
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Invalid Gender!");
        }
      },
    },
    nationality: {
      type: String,
    },
    about: {
      type: String,
      default: "Default About ",
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL type:" + value);
        }
      },
    },
    nationality: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);
// indexing
userSchema.index({ firstName: 1, lastName: 1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
