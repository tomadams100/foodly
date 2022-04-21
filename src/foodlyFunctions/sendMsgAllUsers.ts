const sendMsgAllUsers = async (
  {app,
  welcomeMessageOptions,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DB,
  today,
  userId,
  workspaceId}
) => {
  console.log('Im in the sendMsgAllUsers.js function')
  // Send the message passed into the function to the userID passed in, then it updates the survey collection with the timestamp, channelID and msg type
  try {
    const msgData = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userId,
      text: 'text',
      blocks: welcomeMessageOptions,
    });
    const survey = await DB.getSurvey({ surveyId: today, workspaceId });
    if (survey.messages) {
      console.log('Im in the if')
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [
          ...survey.messages,
          { ts: msgData.ts, channelId: msgData.channel, msgType: 'survey' },
        ],
        workspaceId
      });
    } else {
      console.log('Im in the else')
      console.log({ ts: msgData.ts, channelId: msgData.channel, msgType: 'survey' })
      await DB.updateSurvey({
        surveyId: today,
        field: "messages",
        value: [{ ts: msgData.ts, channelId: msgData.channel, msgType: 'survey' }],
        workspaceId
      });
    }
  } catch (err) {console.log(err)}
};

export {sendMsgAllUsers};
