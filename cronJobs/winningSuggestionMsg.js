const CronJob = require("cron").CronJob;
const DB = require("../DB");
const moment = require("moment");

const cronJob = async (app) => {
  new CronJob(
    "* * * * *", async () => {
      const winningSuggestionMsg = await require("../messages/winningSuggestionMsg")();
      const winngingSuggestionMsgBlocks = winningSuggestionMsg.blocks;
      
      const workspace = await DB.getWorkspace();

      const closeVoteTime = workspace.settings.winnerTime;
      let now = moment().format("HH:mm");
      if (now === closeVoteTime) {
        const allUserIds = await require("../foodlyFunctions/getUserIds")(app);
        allUserIds.forEach((userId) => {
          app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userId,
            text: "Text",
            blocks: winngingSuggestionMsgBlocks,
          });
        });
      }
    }, null, true, "Europe/London").start();
};

module.exports = cronJob;
