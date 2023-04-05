const express = require("express");
const corn = require("node-cron");
const request = require("request");
const dotenv = require("dotenv");
const telegram = require("./src/telegramBot.js");
const messageHandler = require("./src/messageHandler.js");
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

let options = {
  method: "GET",
  url: process.env.MATCH_REQUEST,
};

let oldRes = [];

request(options, (err, res) => {
  if (err) throw new Error(err);

  oldRes = JSON.parse(res.body);
});

corn.schedule("*/2 * * * * *", () => {
  request(options, (err, res) => {
    if (err) throw new Error(err);
    let newRes = JSON.parse(res.body);
    let addedMatches = newRes.filter(
      (item) => !oldRes.some((other) => item.matchId === other.matchId)
    );

    if (addedMatches.length > 0) {
      addedMatches.forEach((element) => {
        telegram.SendMessage(messageHandler.matchMessage(element));
        // console.log(messageHandler.matchMessage(element));
      });
    }
    console.log(`there is ${addedMatches.length} added matches.`);
    oldRes = newRes;
  });
});

app.use("/api/v1/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    massage: "Welcome to tazkarti bot",
  });
});

const port = 8080;
const server = app.listen(port, () => {
  console.log(`console is running on Port ${port}`);
});
