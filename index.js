// import connectToDB from "./dbConnect.js";
// import dotenv from "dotenv";
// import app from "./app.js";

// dotenv.config({
//   path: "./.env",
// });

// connectToDB()
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running at port : ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
//   });
import connectToDB from "./dbConnect.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });
