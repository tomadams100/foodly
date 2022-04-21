import { App } from '@slack/bolt';
import 'dotenv/config';

import homeViewActions from './homeView/homeViewActions';
import welcomeMessageActions from './messages/welcomeMessageActions';
import winningSuggestionMsgActions from './messages/winningSuggestionMsgActions';
import morningMessage from './cronJobs/morningMessage';
import createNewSurvey from './cronJobs/createNewSurvey';
import archiveFoodlyLunchChat from './cronJobs/archiveFoodlyLunchChat';
import winningSuggestionMsg from './cronJobs/winningSuggestionMsg';

import { homeView } from './homeView';

import * as DB from './DB';

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
});

homeViewActions();
welcomeMessageActions();
winningSuggestionMsgActions();
morningMessage();
createNewSurvey();
archiveFoodlyLunchChat();
winningSuggestionMsg();

import './commands';

// Invoke Commands
// require('./commands/index')();

// --------- HOME ------------

app.event('app_home_opened', async ({ body, event, client, logger }) => {
  // Invoke Cron Jobs
  const userId = event.user;
  try {
    const workspace =
      (await DB.getWorkspace({ workspaceId: body.team_id })) ??
      (await DB.createWorkspace({ workspaceId: body.team_id }));

    // console.log('workspace', workspace)
    // if the hasn't clicked 'join' to take part in Foodly (ie their userId isn't saved in workspace users collection) then show a home view with a 'join' button
    if (
      typeof workspace?.users === 'undefined' ||
      !workspace?.users.includes(userId)
    ) {
      const joined = false;
      homeView({ event, client, joined, workspace });
    } else if (workspace.users.includes(userId)) {
      // if the user have joined then show the normal home view (ie the one with the podium of winners and the settings)
      const joined = true;
      homeView({ event, client, joined, workspace });
    }
  } catch (error) {
    logger.error(error);
  }
});
