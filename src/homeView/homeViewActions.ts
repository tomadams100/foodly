import { homeView } from '.';
import * as DB from '../DB';
import { app } from '../app';
import type { BlockAction } from '@slack/bolt';

export default function () {
  // If someone's userId hasn't been stored in the workplace on the DB then it means they haven't clicked the 'join' button yet
  // Show a button saying join, on click update the DB with their userId and then reload the homeView
  app.action('join_foodly', async (props) => {
    const { ack, body } = props;
    const userId = body.user.id;
    const workspaceId = body.team!.id;
    
    await ack();
    
    try {
      // console.log('body', body)
      const workspace = await DB.getWorkspace({
        workspaceId,
      });
      if (workspace?.users) {
        console.log('add to users');
        await DB.updateWorkspace({
          workspaceId,
          field: 'users',
          value: [...workspace.users, userId],
        });
      } else {
        console.log('create users');
        await DB.updateWorkspace({
          workspaceId,
          field: 'users',
          value: [userId],
        });
      }
      let event = { user: userId };
      let client = app.client;
      let joined = true;
      console.log('body', body);
      homeView({ event, client, joined, workspace });
    } catch (err) {
      console.log(err);
    }
  });

  // the save button doesn't do anything, it is just for looks
  app.action('click_save_button', async ({ ack }) => {
    await ack();
    console.log('You clicked the save button.');
  });

  // when they change the time for the survey to be sent, it updates the workspace with the time selected
  app.action<BlockAction>('set_send_msg_time', async (props) => {
    const { ack, body } = props;
    const workspaceId = body.team!.id;
    await ack();

    const timeSelected = (props.payload as any).selected_time; // TODO fix it
    console.log(
      'You tried to choose when to close the vote, close at ',
      timeSelected,
    );
    const workspace = await DB.getWorkspace({ workspaceId });
    await DB.updateWorkspace({
      workspaceId,
      settings: { ...workspace.settings, surveyTime: timeSelected },
    });
  });
  // when they change the time for the winner message to be sent, it updates the workspace with the time selected
  app.action<BlockAction>('set_close_vote_time', async (props) => {
    const { ack, body } = props;
    const workspaceId = body.team!.id;
    await ack();

    const timeSelected = (props.payload as any).selected_time; // TODO fix it
    console.log(
      'You tried to choose when to close the vote, close at ',
      timeSelected,
    );
    const workspace = await DB.getWorkspace({ workspaceId });
    await DB.updateWorkspace({
      workspaceId,
      settings: { ...workspace.settings, winnerTime: timeSelected },
    });
  });
}
