import moment from 'moment';
import * as DB from '../DB';
import { updateMsgAllUsers } from '../foodlyFunctions/updateMsgAllUsers';
const today = moment().format('D.MM.YY');
import util from 'util';

import { app } from '../app';

import { getAllUsersIds } from '../foodlyFunctions/getUserIds';

import {
  BlockAction,
  InteractiveAction,
  InteractiveMessage,
} from '@slack/bolt';

export default function () {
  // console.log('this is the app', app)
  // function to respond to the tags for suggestions being clicked, does nothing
  app.action('tag_suggestions', async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
  });

  app.action<BlockAction>('create_new_suggestion', async (props) => {
    console.log('props', props);
    // modal that is used to create a new suggestion that is saved on the workplace DB collection, this can then be selected for submission into today's survey (after creating it in this modal)
    const { ack, client, body } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'create_new_suggestion_modal_view',
          title: {
            type: 'plain_text',
            text: 'Create New Suggestion',
          },
          submit: {
            type: 'plain_text',
            text: 'Submit',
          },
          blocks: [
            {
              type: 'input',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              block_id: 'place_name_block',
              element: {
                type: 'plain_text_input',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'place_name_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Enter place name...',
                },
              },
              label: {
                type: 'plain_text',
                text: 'Place Name',
                emoji: true,
              },
            },
            {
              type: 'input',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              block_id: 'google_maps_link_block',
              element: {
                type: 'plain_text_input',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'google_maps_link',
                placeholder: {
                  type: 'plain_text',
                  text: 'Enter link...',
                },
              },
              label: {
                type: 'plain_text',
                text: 'Google Maps link',
                emoji: true,
              },
            },
            {
              type: 'section',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              block_id: 'tags_block',
              text: {
                type: 'mrkdwn',
                text: 'Tag your suggestion',
              },
              accessory: {
                type: 'multi_static_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Select options',
                  emoji: true,
                },
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Italian',
                      emoji: true,
                    },
                    value: 'Italian',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Asian',
                      emoji: true,
                    },
                    value: 'Asian',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Mexican',
                      emoji: true,
                    },
                    value: 'Mexican',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Relaxed',
                      emoji: true,
                    },
                    value: 'Relaxed',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Take-away',
                      emoji: true,
                    },
                    value: 'Take-away',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Fancy',
                      emoji: true,
                    },
                    value: 'Fancy',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: 'Good Value',
                      emoji: true,
                    },
                    value: 'Good Value',
                  },
                ],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'tag_suggestions',
              },
            },
          ],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.view('create_new_suggestion_modal_view', async (props) => {
    const { ack, view, body } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    // gets user input (ie the tags, placename, web link)
    const tags =
      view.state.values.tags_block!.tag_suggestions!.selected_options?.map(
        (elem) => elem.value,
      );
    const suggestion = {
      placeName: view.state.values.place_name_block!.place_name_input!.value!,
      googleMaps:
        view.state.values.google_maps_link_block!.google_maps_link!.value!,
      tags: tags,
    };
    console.log(
      'You tried to submit this to the workplace DB:',
      util.inspect(suggestion),
    );
    try {
      // contacts the database and updates the workspace with the suggestion
      // console.log('bodyiii', body)
      const workspace = await DB.getWorkspace({
        workspaceId: body.user.team_id,
      });
      if (workspace.suggestions) {
        if (
          !Object.keys(workspace.suggestions).includes(suggestion.placeName)
        ) {
          await DB.updateWorkspace({
            workspaceId: workspace.id,
            field: 'suggestions',
            value: {
              // [...workspace.suggestions, suggestion],
              ...workspace.suggestions,
              [suggestion.placeName]: suggestion,
            },
          });
        }
      } else {
        await DB.updateWorkspace({
          workspaceId: workspace.id,
          field: 'suggestions',
          value: {
            // [...workspace.suggestions, suggestion],
            [suggestion.placeName]: suggestion,
          },
        });
      }

      // updates all users' survey message so that it will display the suggestion you just created as one of the places you can put forward to be voted on
      const allUserIds = await getAllUsersIds({
        workspaceId: workspace.id,
      });
      for (let i = 0; i < allUserIds.length; i++) {
        updateMsgAllUsers({
          app,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DB,
          userId: allUserIds[i],
          workspaceId: workspace.id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.action<BlockAction>('click_submit_suggestion', async (props) => {
    // this function updated the survey with a suggestion that you are putting forward to be voted on
    const { ack, body } = props;
    const workspaceId = body.user.team_id;
    console.log('props', props);
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    console.log(
      'You clicked on the submit suggestion button to submit ',
      body.state?.values.select_place_dropdown.select_place_option
        .selected_option?.value,
    );
    const suggestion = {
      placeName:
        body.state?.values.select_place_dropdown.select_place_option
          .selected_option?.value,
      suggestedBy: body.user.name,
      votes: 0,
    };
    try {
      const survey = await DB.getSurvey({
        surveyId: today,
        workspaceId,
      });
      if (survey.suggestions) {
        await DB.updateSurvey({
          surveyId: today,
          field: 'suggestions',
          value: [...survey.suggestions, suggestion],
          workspaceId,
        });
      } else {
        await DB.updateSurvey({
          surveyId: today,
          field: 'suggestions',
          value: [suggestion],
          workspaceId,
        });
      }

      updateMsgAllUsers({ app, DB, userId: props.body.user.id, workspaceId });
    } catch (err) {
      console.log(err);
    }
  });

  // nothing happens when you click on the radio buttons for each place that it is possible to vote on
  app.action('vote_radio', async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    return;
  });

  // once you vote the actionId of the vote button changes to vote_already_submitted_button so that when you click on it nothing happens (ie you can't vote more than once)
  app.action('vote_already_submitted_button', async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }
    return;
  });

  app.action<BlockAction>('submit_vote_button', async (props) => {
    // when you click on 'submit vote' it contacts the DB and increments the vote count for the suggestion that you selected
    const { ack, body, payload } = props;
    const userId = body.user.id;
    const workspaceId = body.user.team_id;

    ack();

    const radio_button_selected =
      props.body.state?.values.radio_buttons_votes?.vote_radio?.selected_option
        ?.value;
    console.log('You voted for', radio_button_selected);
    const survey = await DB.getSurvey({
      surveyId: today,
      workspaceId,
    });
    const survey_suggestions = Object.entries(survey.suggestions ?? {});

    // console.log('survey when click vote button', survey)
    for (let i = 0; i < survey.suggestions.length; i++) {
      if (survey.suggestions[i].placeName === radio_button_selected) {
        survey.suggestions[i].votes++;
      }
    }
    // after your voted has been saved on the DB the survey is updated so that the button says 'vote submitted' and the actionId changes to and id that does nothing (so you can't vote twice)
    try {
      await DB.updateSurvey({
        surveyId: today,
        field: 'suggestions',
        value: survey.suggestions,
        workspaceId,
      });

      if (survey.usersVoted) {
        await DB.updateSurvey({
          surveyId: today,
          field: 'usersVoted',
          value: [...survey.usersVoted, userId],
          workspaceId,
        });
      } else {
        await DB.updateSurvey({
          surveyId: today,
          field: 'usersVoted',
          value: [userId],
          workspaceId,
        });
      }

      updateMsgAllUsers({ app, DB, userId, workspaceId });
    } catch (err) {
      console.log(err);
    }
  });
}
