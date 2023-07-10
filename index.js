require("dotenv").config();
const express = require("express");
const path = require("path");
const validator = require("./lib/validator");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self"],
    },
  })
);

const PORT = 3000;
const options = {
  root: path.join(__dirname),
};

app.get("/", (req, res) => {
  const { api } = req.query;
  if (validator.validate(api)) {
    res.type(".js");
    res.sendFile("./lib/tracker.js", options, (error) => {
      if (error) {
        res.send("Invalid API key");
      }
    });
  } else {
    res.status(404).send("Cannot find what you're looking for.");
  }
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log("Server is running...");
});
