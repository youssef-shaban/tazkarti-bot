const request = require("request");

exports.SendMessage = (message) => {
  let options = {
    method: "POST",
    url: `${process.env.TELEGRAM_API.replace(
      "<TOKEN>",
      process.env.TELGRAM_BOT_TOKEN
    )}sendMessage`,

    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "MarkdownV2",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  request(options, (err, res) => {
    console.log(res.body);
  });
};
