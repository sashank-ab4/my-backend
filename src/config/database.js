const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose.connect(process.env.DB_CONNECTION);
};

module.exports = connectDatabase;
