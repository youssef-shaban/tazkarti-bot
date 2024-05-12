const express = require("express");
const corn = require("node-cron");
const axios = require("axios");
const dotenv = require("dotenv");
const telegram = require("./src/telegramBot.js");
const messageHandler = require("./src/messageHandler.js");
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

let oldRes = [];
let getMatchesDone = false;

const getMatches = async () => {
  while (true) {
    const response = await axios.get(
      process.env.MATCH_REQUEST.replace("<TIME>", new Date().getTime()),
      {
        validateStatus: (status) => {
          return true;
        },
      }
    );
    if (response.status == 200) {
      oldRes = response.data;
      getMatchesDone = true;
      break;
    }
    console.log("💥💥 WRONG REQUEST");
  }
};

getMatches();
app.use("/api/v1/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    massage: "Welcome to tazkarti bot",
  });
});

corn.schedule("*/2 * * * * *", async () => {
  if (!getMatchesDone) return;

  let res = await axios.get(
    process.env.MATCH_REQUEST.replace("<TIME>", new Date().getTime()),
    {
      validateStatus: function (status) {
        return true;
      },
    }
  );

  if (res.status != 200) {
    console.log("💥💥 WRONG REQUEST");
    return;
  }
  const newRes = res.data;
  const addedMatches = newRes.filter(
    (item) => !oldRes.some((other) => item.matchId === other.matchId)
  );

  addedMatches.forEach((element) => {
    telegram.SendMessage(messageHandler.matchMessage(element));
    // console.log(messageHandler.matchMessage(element));
  });

  console.log(`there is ${addedMatches.length} added matches.`);
  oldRes = newRes;
});

const port = 8080;
const server = app.listen(port, () => {
  console.log(`console is running on Port ${port}`);
});
