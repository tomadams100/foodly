import { CronJob } from 'cron';
import * as DB from '../DB';
import moment from 'moment';
import { sendMsgAllUsers } from '../foodlyFunctions/sendMsgAllUsers';
import { app } from '../app';
import { welcomeMessage } from '../messages/welcomeMessage';
import { getAllUsersIds } from '../foodlyFunctions/getUserIds';

const today = moment().format('D.MM.YY');

export default async () => {
  // console.log('this is the app', app)
  // Cron job to constantly check if the time now is the same as the time in the settings
  // sends out the survey to get people to make suggestions and vote
  new CronJob(
    `* * * * *`,
    async () => {
      /*
      get the workspaceId

      receive body

      look inside the body to find the workspaceId
    */
      try {
        // get all the workspace IDs then loop through them checking if now ==== time for each one
        const workspaceIds = await DB.getAllWorkspaceIds();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < workspaceIds.length; i++) {
          const morningMsgTime = await DB.getWorkspace({
            workspaceId: workspaceIds[i],
          });
          const now = moment().format('HH:mm');
          if (now === morningMsgTime.settings.surveyTime) {
            // const { welcomeMessage } = require('../messages/welcomeMessage');
            const { blocks } = await welcomeMessage({
              workspaceId: workspaceIds[i],
            });
            const welcomeMessageOptions = blocks;
            // get all the users Ids that are stored in the DB under the workspace collection
            const allUserIds = await getAllUsersIds({
              workspaceId: workspaceIds[i],
            });
            // go through each id and them them the survey message
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < allUserIds.length; j++) {
              sendMsgAllUsers({
                app,
                welcomeMessageOptions,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                DB,
                today,
                userId: allUserIds[j],
                workspaceId: workspaceIds[i],
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    null,
    true,
    'Europe/London',
  ).start();
};
