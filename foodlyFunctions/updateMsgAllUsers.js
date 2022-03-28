const moment = require("moment");
const today = moment().format("D.MM.YY");

const updateMsgAllUsers = async (app, DB, userHasVoted) => {
  const welcomeMessage = await require("../messages/welcomeMessage")(app);
  const welcomeMessageOptions = welcomeMessage.blocks;

  if (userHasVoted) {
    welcomeMessageOptions[welcomeMessageOptions.length - 1].elements[0].text.text = "Vote Submitted";
    welcomeMessageOptions[welcomeMessageOptions.length - 1].elements[0].action_id = "vote_already_submitted_button";
  }

  const survey = await DB.getSurvey({ surveyId: today });
  const messages = survey.messages;
  const numberOfMessages = messages.length;
  for (let i = 0; i < numberOfMessages; i++) {
    const ts = messages[i].ts;
    const channelId = messages[i].channelId;
    app.client.chat.update({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      ts: ts,
      text: "some text",
      blocks: welcomeMessageOptions,
    });
  }
};
module.exports = updateMsgAllUsers;
