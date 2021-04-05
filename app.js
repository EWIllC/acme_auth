const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const {
  models: { User },
} = require("./db");
const path = require("path");

const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.post("/api/auth", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    console.log(user);
    const token = jwt.sign({ userId: user }, SECRET_KEY);
    console.log(token);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth", async (req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);
    console.log("USER", user);

    //const verify = jwt.verify(token, SECRET_KEY);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
