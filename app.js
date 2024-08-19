// app.js
import express from "express";
import { userModel } from "./models/userModel.js"; // Adjust the path as necessary
import bodyParser from "body-parser";
import cors from "cors";
// import user from "./routers/";
import user from "./routes/userRouter.js";

const app = express(); // Declare app
// app.use(bodyParser);
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use("/api/v1", user);

// Example route using the userModel
app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
app.post("/addUser", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const newUser = new userModel({
      name,
      email,
      phone,
      password,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});
*/
export default app;
