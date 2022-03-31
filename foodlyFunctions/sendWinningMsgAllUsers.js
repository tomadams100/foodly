const sendWinningMsgAllUsers = async (
  app,
  winngingSuggestionMsgBlocks,
  DB,
  today,
  userId
) => {
  const msgData = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: userId,
    text: "Text",
    blocks: winngingSuggestionMsgBlocks,
  });
  const survey = await DB.getSurvey({ surveyId: today });
    if (survey.messages) {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [
          ...survey.messages,
          { ts: msgData.ts, channelId: msgData.channel, msgType: 'winner' },
        ],
      });
    } else {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [{ ts: msgData.ts, channelId: msgData.channel, msgType: 'winner' }],
      });
    }
};

module.exports = sendWinningMsgAllUsers;
