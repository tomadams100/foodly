import { app } from '../app';
import { CronJob } from 'cron';
import * as DB from '../DB';
import moment from 'moment';

const today = moment().format('D.MM.YY');

export default async () => {
  // Cron job so that at midnight every night, the chat from that day will be archived
  new CronJob(
    '0 0 * * *',
    async () => {
      console.log('Archive Chat');
      const workspaceIds = await DB.getAllWorkspaceIds();
      for (let i = 0; i < workspaceIds.length; i++) {
        try {
          const survey = await DB.getSurvey({
            surveyId: today,
            workspaceId: workspaceIds[i],
          });
          const foodlyLunchChat = survey.foodlyLunchChat;
          app.client.conversations.archive({
            channel: foodlyLunchChat,
            token: process.env.SLACK_BOT_TOKEN,
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    null,
    true,
    'Europe/London',
  ).start();
};
