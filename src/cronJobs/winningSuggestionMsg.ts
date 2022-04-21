import { CronJob } from 'cron';
import moment from 'moment';

import { app } from '../app';
import * as DB from '../DB';
import { getAllUsersIds } from '../foodlyFunctions/getUserIds';
import { sendWinningMsgAllUsers } from '../foodlyFunctions/sendWinningMsgAllUsers';
import {
  getWinningPlace,
  addWinningPlace,
  winngingSuggestionMsg,
} from '../messages/winningSuggestionMsg';

const today = moment().format('D.MM.YY');

export default async () => {
  // Cron job checks if the time now is the same as the time in the settings to send the message about who has won the daily vote
  new CronJob(
    '* * * * *',
    async () => {
      // get all the workspace IDs then loop through them checking if now ==== time for each one
      const workspaceIds = await DB.getAllWorkspaceIds();
      for (let i = 0; i < workspaceIds.length; i++) {
        const workspace = await DB.getWorkspace({
          workspaceId: workspaceIds[i],
        });

        const closeVoteTime = workspace?.settings.winnerTime;
        let now = moment().format('HH:mm');
        if (now === closeVoteTime) {
          console.log('1');
          const winningPlace = await getWinningPlace({
            surveyId: today,
            workspaceId: workspaceIds[i],
          });
          const survey = await DB.getSurvey({
            surveyId: today,
            workspaceId: workspaceIds[i],
          });

          await addWinningPlace({
            workspace,
            // add today's date to winningPlace object
            winningPlace: { ...winningPlace, date: today },
          });

          const foodlyChatChannelURL = `slack://channel?team=${workspace.id}&id=${survey.foodlyLunchChat}`;

          const blocks = await winngingSuggestionMsg({
            winningPlace,
            url: foodlyChatChannelURL,
          });
          const winngingSuggestionMsgBlocks = blocks;
          // gets all user IDs from workspace collection on DB then sends the winner message to all the IDs
          const allUserIds = await getAllUsersIds({
            app,
            workspaceId: workspaceIds[i],
          });
          for (let j = 0; j < allUserIds.length; j++) {
            sendWinningMsgAllUsers({
              app,
              winngingSuggestionMsgBlocks,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              DB,
              today,
              userId: allUserIds[j],
              workspaceId: workspaceIds[i],
            });
          }
        }
      }
    },
    null,
    true,
    'Europe/London',
  ).start();
};
