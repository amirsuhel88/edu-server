const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userModel = require("./models/userModel");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json);

module.exports = app;
