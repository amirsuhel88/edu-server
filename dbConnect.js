// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

// const connectToDB = async () => {
//   try {
//     // const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${DB_NAME}`
//     );
//     console.log(
//       `\n MongoDB connection !! DB HOST:${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("MONGODB connection Failed", error);
//     process.exit(1);
//   }
// };

// export default connectToDB;
import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\nMongoDB connection!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection Failed", error);
    process.exit(1);
  }
};

export default connectToDB;
