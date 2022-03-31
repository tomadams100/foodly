const moment = require("moment");
const today = moment().format("D.MM.YY");
const util = require("util");

const updateWinningMsgAllUsers = async (app, DB) => {
  try {
    
    const winningMsg = await require("../messages/winningSuggestionMsg")(app);
    const winningMsgBlocks = winningMsg.blocks;
    
    const survey = await DB.getSurvey({ surveyId: today });
    const workspace = await DB.getWorkspace()
    const messages = survey.messages;
    const numberOfMessages = messages.length;
    
    if (typeof survey.foodlyLunchChat !== 'undefined') {
      winningMsgBlocks[winningMsgBlocks.length - 1].elements[1].url = `slack://channel?team=${workspace.id}&id=${survey.foodlyLunchChat}`
    }
    
    for (let i = 0; i < numberOfMessages; i++) {
      const ts = messages[i].ts;
      const channelId = messages[i].channelId;
      if (messages[i].msgType === 'winner') {
        app.client.chat.update({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          ts: ts,
          text: "some text",
          blocks: winningMsgBlocks,
        });
      }
    }
  } catch (err) {console.log(err)}
};
module.exports = updateWinningMsgAllUsers;
