const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.DB_URI}`
    );
    console.log("MongoDB connection SUCCESS");
  } catch (err) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;