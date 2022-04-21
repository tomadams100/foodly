import { app } from '../app';

import * as DB from '../DB';

import moment from 'moment';

const today = moment().format('D.MM.YY');

// Create a command so that when a user types /foodly they are either told that the voting is still taking place or who has won
app.command('/foodly', async (props) => {
  const { ack, respond } = props;
  await ack();
  console.log('Im in the foodly command');
  const workspace = await DB.getWorkspace({
    workspaceId: props.body.team_id,
  });
  let now = moment().format('HH:mm');
  console.log('workspace', workspace.settings.winnerTime);
  console.log('now', now);
  if (now < workspace.settings.winnerTime) {
    // If the time now is less than the time in the settings then voting is still ongoing
    return respond({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_type: 'ephemeral',
      text: 'Voting is still taking place. Cast your vote to get involved!',
    });
  } else {
    console.log('display winner name');
    const survey = await DB.getSurvey({
      surveyId: today,
      workspaceId: props.body.team_id,
    });
    let winningPlace = {
      placeName: 'Place holder name',
      suggestedBy: 'Place holder person',
      votes: 0,
    };
    let response = ``;
    if (survey.suggestions) {
      for (let i = 0; i < survey.suggestions.length; i++) {
        if (survey.suggestions[i].votes > winningPlace.votes) {
          winningPlace = { ...survey.suggestions[i] };
          response = `Today's most voted suggestion ${survey.suggestions[i].placeName}`;
        }
      }
      return respond({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_type: 'ephemeral',
        text: response,
      });
    }
  }
});
