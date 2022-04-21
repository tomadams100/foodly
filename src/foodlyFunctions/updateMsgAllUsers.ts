import moment from 'moment';

import { welcomeMessage } from '../messages/welcomeMessage';

const today = moment().format('D.MM.YY');

// eslint-disable-next-line @typescript-eslint/naming-convention
const updateMsgAllUsers = async ({ app, DB, userId, workspaceId }) => {
  try {
    // The function receives a userId and then updates the survey message for that user
    const { blocks } = await welcomeMessage({ workspaceId });
    const welcomeMessageOptions: any = blocks;

    const survey = await DB.getSurvey({ surveyId: today, workspaceId });
    // console.log('surveyyyy', survey)
    const messages = survey.messages;
    const numberOfMessages = messages.length;

    if (typeof survey.usersVoted !== 'undefined') {
      if (survey.usersVoted.includes(userId)) {
        // if the user has voted the the button says Vote Submitted and change the action id to one that does nothing
        welcomeMessageOptions[
          welcomeMessageOptions.length - 1
        ].elements[0].text.text = 'Vote Submitted';
        welcomeMessageOptions[
          welcomeMessageOptions.length - 1
        ].elements[0].action_id = 'vote_already_submitted_button';
      }
    }

    for (let i = 0; i < numberOfMessages; i++) {
      const ts = messages[i].ts;
      const channelId = messages[i].channelId;
      if (messages[i].msgType === 'survey') {
        // only update survey messages (not messages say who won the vote)
        app.client.chat.update({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          ts,
          text: 'some text',
          blocks: welcomeMessageOptions,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
export { updateMsgAllUsers };
