const CronJob = require("cron").CronJob;
const DB = require("../DB");
const moment = require("moment");
const sendWinningMsgAllUsers = require("../foodlyFunctions/sendWinningMsgAllUsers");
const today = moment().format("D.MM.YY");

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
        for (let i = 0; i < allUserIds.length; i++) {
          sendWinningMsgAllUsers(app, winngingSuggestionMsgBlocks, DB, today, allUserIds[i])
        }
      }
    }, null, true, "Europe/London").start();
};

module.exports = cronJob;
