// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import * as DB from '../DB';

import { winngingSuggestionMsg, getWinningPlace } from '../messages/winningSuggestionMsg';

const today = moment().format('D.MM.YY');

export const updateWinningMsgAllUsers = async ({ app, workspaceId }) => {
  try {
    // function updates the winning message for all users
    
    const winningPlace = await getWinningPlace({surveyId: today,
      workspaceId})
    const survey = await DB.getSurvey({
      surveyId: today,
      workspaceId,
    });
    // const workspace = await DB.getWorkspace({ workspaceId: body.team_id });
    const messages = survey.messages;
    const numberOfMessages = messages.length;

    const foodlyChatChannelURL = `slack://channel?team=${workspaceId}&id=${survey.foodlyLunchChat}`;
    const winningMsgBlocks = await winngingSuggestionMsg({
      winningPlace,
      url: foodlyChatChannelURL,
    });

    // if (typeof survey.foodlyLunchChat !== 'undefined') {
    //   winningMsgBlocks[
    //     winningMsgBlocks.length - 1
    //   ].elements![1].url = `slack://channel?team=${workspaceId}&id=${survey.foodlyLunchChat}`;
    // }

    for (let i = 0; i < numberOfMessages; i++) {
      const ts = messages[i].ts;
      const channelId = messages[i].channelId;
      if (messages[i].msgType === 'winner') {
        // only update messages announcing the winner, ie not the survey messages
        app.client.chat.update({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          ts,
          text: 'some text',
          blocks: winningMsgBlocks,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
