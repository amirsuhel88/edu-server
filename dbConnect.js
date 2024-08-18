const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/edu-app");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDB;
