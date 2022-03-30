const CronJob = require("cron").CronJob;
const DB = require("../DB");
const moment = require("moment");

const cronJob = async (app) => {
  new CronJob(
    "* * * * *", async () => {
      const winningSuggestionMsg = await require("../messages/winningSuggestionMsg")();
      const winngingSuggestionMsgBlocks = winningSuggestionMsg.blocks;
      
      // const winnerPlaceName = (winngingSuggestionMsgBlocks[2].text.text).split(' ')[5]
      // const winnerVotes = (winngingSuggestionMsgBlocks[2].text.text).split(' ')[7]
      // const suggestedBy = (winngingSuggestionMsgBlocks[2].text.text).split(' ')[12].split('').filter(elem => elem !== '*').join('')
      const workspace = await DB.getWorkspace();
      // let winner = {}
      // for (let i = 0; i < workspace.suggestions.length; i++) {
      //   if (winnerPlaceName === workspace.suggestions[i].placeName) {
      //     winner = workspace.suggestions[i]
      //     winner.votes = winnerVotes
      //     winner.suggestedBy = suggestedBy
      //   }
      // }
      // console.log({winner})

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
        //await DB.updateWorkspace({workspaceId: workspace.id, field: 'winHistory', value: []})
      }
    }, null, true, "Europe/London").start();
};

module.exports = cronJob;
