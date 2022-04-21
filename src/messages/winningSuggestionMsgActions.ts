import { BlockAction } from '@slack/bolt';
import moment from 'moment';

import { app } from '../app';
import * as DB from '../DB';
import { updateWinningMsgAllUsers } from '../foodlyFunctions/updateWinningMsgAllUsers';

const today = moment().format('D.MM.YY');
const todayForChannelName = today.replace(/\./g, '-');

/**
 *
 */
export default function () {
  app.action<BlockAction>('see_votes_button', async (props) => {
    // displays a modal that contacts the DB and displays how many votes each suggestion got
    const { ack, client, body } = props;
    await ack();
    // console.log('body', body)
    const survey = await DB.getSurvey({
      surveyId: today,
      workspaceId: body.user.team_id,
    });
    let text = `*Votes* \n \n`;
    const suggestions_vote_order = [...survey.suggestions].sort((a, b) => {
      if (a.votes < b.votes) {
        return 1;
      }
      if (a.votes > b.votes) {
        return -1;
      }

      return 0;
    });

    for (let i = 0; i < suggestions_vote_order.length; i++) {
      text += `${suggestions_vote_order[i].votes} votes - ${suggestions_vote_order[i].placeName}\n`;
    }

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Votes',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text,
            },
          },
        ],
      },
    });
  });

  app.action('launch_lunch_chat_button', async (props) => {
    const { ack, client, body } = props;
    const workspaceId = body.user.team_id;
    const survey = await DB.getSurvey({ surveyId: today, workspaceId });
    const usersVoted = survey.usersVoted.join(', ');
    try {
      if (!survey.foodlyLunchChat) {
        await ack();
        const foodlyLunchChat = await client.conversations.create({
          token: process.env.SLACK_BOT_TOKEN,
          name: `foodly-lunch-chat-${todayForChannelName}`,
        });
        await DB.updateSurvey({
          surveyId: today,
          field: 'foodlyLunchChat',
          value: foodlyLunchChat.channel!.id,
          workspaceId,
        });
        await client.conversations.invite({
          channel: foodlyLunchChat.channel!.id!,
          users: usersVoted,
          token: process.env.SLACK_BOT_TOKEN,
        });
        updateWinningMsgAllUsers({ app, workspaceId });
      } else {
        await ack();
      }
    } catch (err) {
      await ack();
      console.log(err);
    }
  });
}
