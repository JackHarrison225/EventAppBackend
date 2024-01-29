const express = require("express");
const mongoose = require("mongoose");
const { Ad } = require("./models/ad");
const { User } = require("./models/user");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const cors = require("cors");

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err.message);
  });

// defining the Express app
const app = express();

app.use(cors());
app.use(express.json());

// Authorization generation endpoint
app.post("/auth", async (req, res) => {
  console.log("arrived");
  console.log(req.body);
  const user = await User.findOne({ username: req.body.username });
  console.log(user);
  if (!user) {
    return res.sendStatus(403);
  }
//   do not store password in plain text - its just for learning purposes
  if (req.body.password !== user.password) {
    console.log("wrong password");
    return res.sendStatus(403);
  }
//   code to generate token
  user.token = uuidv4();
  await user.save();
  res.send({ token: user.token });
});

// Authorization middleware
app.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const user = await User.findOne({ token: authHeader });
  if (user) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// defining CRUD operations
app.get("/", async (req, res) => {
  res.send(await Ad.find());
});

app.post("/", async (req, res) => {
  const newAd = req.body;
  const ad = new Ad(newAd);
  await ad.save();
  res.send({ message: "New ad inserted." });
});

app.delete("/:id", async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.send({ message: "Ad removed." });
});

app.put("/:id", async (req, res) => {
  await Ad.findByIdAndUpdate(req.params.id, req.body);
  res.send({ message: "Ad updated." });
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});