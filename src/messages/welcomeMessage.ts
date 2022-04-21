import * as DB from '../DB';
import moment from 'moment';
import * as util from 'util';
import { app } from '../app';

const today = moment().format('D.MM.YY');

const voteOptions = async ({ surveyId, workspaceId }) => {
  // function contacts the DB and finds all the places that have been suggested in today's survey
  let survey = await DB.getSurvey({ surveyId, workspaceId });
  const voteOptionsArray: any[] = [];

  if (survey === null) {
    survey = await DB.createSurvey({ surveyId, workspaceId });
  }

  if (!survey.suggestions || survey.suggestions.length === 0) {
    voteOptionsArray.push({
      text: {
        type: 'plain_text',
        text: `Suggest somewhere`,
        emoji: true,
      },
      value: `Suggest somewhere`,
    });

    return voteOptionsArray;
  }

  for (let i = 0; i < survey.suggestions.length; i++) {
    voteOptionsArray.push({
      text: {
        type: 'plain_text',
        text: `Vote ${survey.suggestions[i].placeName} 👍`,
        emoji: true,
      },
      value: survey.suggestions[i].placeName,
    });
  }

  return voteOptionsArray;
};

function diff(list1, list2) {
  if (!list1 || !list2) return;
  return list1.filter((elem) => !list2.includes(elem));
}

const placeOptions = async ({ surveyId, workspaceId }) => {
  // I have added in workspaceId as a param for testing purposes, ie to return workspaces without suggestions
  // displays all of the places that have been submitted to the workplace DB collection for potential suggestions
  // console.log('hey', workspaceId)
  // console.log('workspaceId', workspaceId)
  const workspace = await DB.getWorkspace({ workspaceId });
  let workspaceSuggestions = Object.values(workspace.suggestions).map(
    (elem: any) => elem.placeName,
  );
  // console.log({ workspace_suggestions })

  const survey = await DB.getSurvey({ surveyId, workspaceId });
  //  console.log(util.inspect( survey) )
  let surveySuggestions = Object.values(
    survey.suggestions ?? {}, // TODO define type of getSurvey
  ).map(({ placeName }) => placeName);

  let options = diff(workspaceSuggestions, surveySuggestions).map(
    // only display options that haven't already been suggested
    (elem) => {
      return {
        text: {
          type: 'plain_text',
          text: elem, // elem.placeName,
          emoji: true,
        },
        value: elem, // elem.placeName,
      };
    },
  );
  // console.log( {options} )
  // console.log("options.length", options.length)
  if (options.length === 0) {
    options = [
      {
        text: {
          type: 'plain_text',
          text: 'Place Holder Name',
          emoji: true,
        },
        value: 'Place Holder Name',
      },
    ];
  }
  return options;
};

const welcomeMessage = async ({ workspaceId }) => {
  // console.log('heeeeee', workspaceId)

  let selectedOption = 'default';

  app.action('select_place_option', async (props: any) => {
    // when a user selects and option its saved into the selected_option variable
    console.log('props', props);
    const { ack } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    console.log('You selected', props.payload.selected_option.value);
    selectedOption = props.payload.selected_option.value;
  });

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🍔 Foodly',
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        block_id: 'select_place_dropdown',
        text: {
          type: 'mrkdwn',
          text: 'Pick an item from the dropdown list',
        },
        accessory: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select an item',
            emoji: true,
          },
          options: await placeOptions({ surveyId: today, workspaceId }), // contacts the DB and returns the places that you can choose to submit as your suggestion of where to have lunch
          // eslint-disable-next-line @typescript-eslint/naming-convention
          action_id: 'select_place_option',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Submit Suggestion',
              emoji: true,
            },
            value: selectedOption,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            action_id: 'click_submit_suggestion',
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Create New Suggestion',
              emoji: true,
            },
            value: 'create_new_suggestion',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            action_id: 'create_new_suggestion',
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' *Vote Here:*',
        },
      },
      {
        type: 'actions',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        block_id: 'radio_buttons_votes',
        elements: [
          {
            type: 'radio_buttons',
            options: await voteOptions({ surveyId: today, workspaceId }), // contacts DB and returns the places that people have suggested for today's survey, and you can vote on these
            // eslint-disable-next-line @typescript-eslint/naming-convention
            action_id: 'vote_radio',
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Submit Vote',
              emoji: true,
            },
            value: 'value sent from submit vote button being clicked',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            action_id: 'submit_vote_button',
          },
        ],
      },
    ],
  };
};
export { welcomeMessage, voteOptions, placeOptions as place_options };
