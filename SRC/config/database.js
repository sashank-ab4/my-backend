const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://asashank04me_db_user:RyTvbjEWCPTIjgtu@sashanknode.xf7j7qi.mongodb.net/FirstDatabase",
  );
};

module.exports = connectDatabase;
