const moment = require("moment");
const today = moment().format("D.MM.YY");
const util = require("util");

const updateMsgAllUsers = async (app, DB, userId) => {
  try {
    
    const welcomeMessage = await require("../messages/welcomeMessage")(app);
    const welcomeMessageOptions = welcomeMessage.blocks;
    
    const survey = await DB.getSurvey({ surveyId: today });
    const messages = survey.messages;
    const numberOfMessages = messages.length;
    
    if (typeof survey.usersVoted !== 'undefined') {
      if (survey.usersVoted.includes(userId)) {
        welcomeMessageOptions[
          welcomeMessageOptions.length - 1
        ].elements[0].text.text = "Vote Submitted";
        welcomeMessageOptions[
          welcomeMessageOptions.length - 1
        ].elements[0].action_id = "vote_already_submitted_button";
      }
    }
    
    for (let i = 0; i < numberOfMessages; i++) {
      const ts = messages[i].ts;
      const channelId = messages[i].channelId;
      if (messages[i].msgType === 'survey') {
        app.client.chat.update({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          ts: ts,
          text: "some text",
          blocks: welcomeMessageOptions,
        });
      }
    }
  } catch (err) {console.log(err)}
};
module.exports = updateMsgAllUsers;
