import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import user from "./routes/userRouter.js";
import auth from "./routes/authRouter.js";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//router connection
app.use("/api/v1", user);
app.use("/api/v2", auth);

export default app;
