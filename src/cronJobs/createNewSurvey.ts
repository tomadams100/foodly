import { CronJob } from 'cron';
import * as DB from '../DB';
import moment from 'moment';
const today = moment().format('D.MM.YY');

export default async () => {
  // Cron job that runs at midnight each day to create a new survey for that day
  new CronJob(
    `1 0 * * *`,
    async () => {
      try {
        const workspaceIds = await DB.getAllWorkspaceIds();
        for (let i = 0; i < workspaceIds.length; i++) {
          await DB.createSurvey({
            surveyId: today,
            workspaceId: workspaceIds[i],
          });
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
