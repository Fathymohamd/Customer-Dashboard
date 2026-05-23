const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);

  } catch (err) {
    console.log("MongoDB Connection Error ", err);
  }
};

module.exports = connectDB;