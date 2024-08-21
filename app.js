import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import auth from "./routes/authRouter.js";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//this should work
//router connection
app.use("/api/v2", auth);

export default app;
