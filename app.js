import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
// import user from "./routes/userRouter.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes import
import auth from "./routes/authRouter.js";

//router connection
app.use("/api/v1", auth);
// app.use("/api/v2", auth);

export default app;
