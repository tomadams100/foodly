const sendWinningMsgAllUsers = async (
  {
    app,
    winngingSuggestionMsgBlocks,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DB,
    today,
    userId,
    workspaceId
  }
) => {
  console.log('2')
  try {
    // // Send the message passed into the function to the userID passed in, then it updates the survey collection with the timestamp, channelID and msg type
    const msgData = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userId,
      text: "Text",
      blocks: winngingSuggestionMsgBlocks,
    });
    const survey = await DB.getSurvey({ surveyId: today, workspaceId });
    // console.log('survey', survey)
    if (survey.messages) {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [
          ...survey.messages,
          { ts: msgData.ts, channelId: msgData.channel, msgType: 'winner' },
        ],
        workspaceId
      });
    } else {
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [{ ts: msgData.ts, channelId: msgData.channel, msgType: 'winner' }],
        workspaceId
      });
    }
  } catch (err) {console.log(err)}
};

export {sendWinningMsgAllUsers};
