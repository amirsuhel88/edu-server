import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://rubuli005:6szgYIWr6JbRP6TX@cluster0.ozkhq.mongodb.net"
    );
    console.log(
      `\n MongoDB connection !! DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection Failed", error);
    process.exit(1);
  }
};

export default connectToDB;
