const express = require("express");
const corn = require("node-cron");
const request = require("request");
const dotenv = require("dotenv");
const telegram = require("./telegramBot.js");
const messageHandler = require("./messageHandler.js");
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

corn.schedule("*/5 * * * * *", () => {
  request(options, (err, res) => {
    if (err) throw new Error(err);
    let newRes = JSON.parse(res.body);
    let difference = newRes.filter(
      (item) => !oldRes.some((other) => item.matchId === other.matchId)
    );
    if (difference.length > 0) {
      difference.forEach((element) => {
        telegram.SendMessage(messageHandler.matchMessage(element));
      });
    }
    oldRes = newRes;
  });
});

const port = 8000;
const server = app.listen(port, () => {
  console.log(`console is running on Port ${port}`);
});
