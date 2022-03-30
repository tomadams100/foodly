const sendMsgAllUsers = async (
  app,
  welcomeMessageOptions,
  DB,
  today,
  userId
) => {
  try {

    const msgData = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userId,
      blocks: welcomeMessageOptions,
    });
    const survey = await DB.getSurvey({ surveyId: today });
    if (survey.messages) {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [
          ...survey.messages,
          { ts: msgData.ts, channelId: msgData.channel },
        ],
      });
    } else {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [{ ts: msgData.ts, channelId: msgData.channel }],
      });
    }
  } catch (err) {console.log(err)}
};

module.exports = sendMsgAllUsers;
