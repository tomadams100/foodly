const DB = require("../DB");
const updateMsgAllUsers = require("../foodlyFunctions/updateMsgAllUsers");
const moment = require("moment");
const today = moment().format("D.MM.YY");
const util = require('util')

module.exports = function (app) {
  app.action('tag_suggestions', async (props) => {
    const { ack } = props
    try {
      await ack()
    } catch (err) {console.log(err)}
  })

  app.action('create_new_suggestion', async (props) => {
    const { ack, client, body } = props
    try {
      await ack()
    } catch (err) {console.log(err)}

    try {
      await client.views.open(
        {
          trigger_id: body.trigger_id,
          view: {
            type: 'modal',
            callback_id: 'create_new_suggestion_modal_view',
            title: {
              type: 'plain_text',
              text: 'Create New Suggestion'
            },
            submit: {
              "type": "plain_text",
               "text": "Submit"
            },
            blocks:[
                {
                  type: "input",
                  block_id: "place_name_block",
                  element: {
                    type: "plain_text_input",
                    action_id: "place_name_input",
                    placeholder: {
                      type: "plain_text",
                      text: "Enter place name...",
                    },
                  },
                  label: {
                    type: "plain_text",
                    text: "Place Name",
                    emoji: true,
                  }
                },
                {
                  type: "input",
                  block_id: "google_maps_link_block",
                  element: {
                    type: "plain_text_input",
                    action_id: "google_maps_link",
                    placeholder: {
                      type: "plain_text",
                      text: "Enter link...",
                    },
                  },
                  label: {
                    type: "plain_text",
                    text: "Google Maps link",
                    emoji: true,
                  }
                },
                {
                  type: "section",
                  block_id: "tags_block",
                  text: {
                    type: "mrkdwn",
                    text: "Tag your suggestion",
                  },
                  accessory: {
                    type: "multi_static_select",
                    placeholder: {
                      type: "plain_text",
                      text: "Select options",
                      emoji: true,
                    },
                    options: [
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Italian",
                          "emoji": true
                        },
                        "value": "Italian"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Asian",
                          "emoji": true
                        },
                        "value": "Asian"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Mexican",
                          "emoji": true
                        },
                        "value": "Mexican"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Relaxed",
                          "emoji": true
                        },
                        "value": "Relaxed"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Take-away",
                          "emoji": true
                        },
                        "value": "Take-away"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Fancy",
                          "emoji": true
                        },
                        "value": "Fancy"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "Good Value",
                          "emoji": true
                        },
                        "value": "Good Value"
                      }
                    ],
                    action_id: "tag_suggestions",
                  }
                }
            ]
        }
      })
    } catch (err) {console.log(err)}
  })

  app.view('create_new_suggestion_modal_view', async (props) => {
    const { ack, view } = props
    try {
      await ack()
    } catch (err) {console.log(err)}
    const tags = view.state.values.tags_block.tag_suggestions.selected_options.map(elem => elem.value)
    const suggestion = {
          placeName: view.state.values.place_name_block.place_name_input.value,
          googleMaps: view.state.values.google_maps_link_block.google_maps_link.value,
          tags: tags
        };
    console.log('You tried to submit this to the workplace DB:', util.inspect(suggestion))
    try {
      const workspace = await DB.getWorkspace();
      if (workspace.suggestions) {
        await DB.updateWorkspace({
          workspaceId: workspace.id,
          field: "suggestions",
          value: [...workspace.suggestions, suggestion],
        });
      } else {
        await DB.updateWorkspace({
          workspaceId: workspace.id,
          field: "suggestions",
          value: [suggestion],
        });
      }
  
      updateMsgAllUsers(app, DB);
    } catch (err) {console.log(err)}
  })

  app.action("click_submit_suggestion", async (props) => {
    const { ack, body } = props;
    
    try {
      await ack();
    } catch (err) {console.log(err)}
    console.log(
      "You clicked on the submit suggestion button to submit ",
      body.state.values.select_place_dropdown.select_place_option
        .selected_option.value
    );
    const suggestion = {
      placeName:
        body.state.values.select_place_dropdown.select_place_option
          .selected_option.value,
      suggestedBy: body.user.name,
      votes: 0,
    };
    try {
      const survey = await DB.getSurvey({ surveyId: today });
      if (survey.suggestions)
        await DB.updateSurvey({
          surveyId: today,
          field: "suggestions",
          value: [...survey.suggestions, suggestion],
        });
      else
        await DB.updateSurvey({
          surveyId: today,
          field: "suggestions",
          value: [suggestion],
        });
  
      updateMsgAllUsers(app, DB);
    } catch (err) {console.log(err)}
  });

  app.action("vote_radio", async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {console.log(err)}
    return;
  });

  app.action("vote_already_submitted_button", async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {console.log(err)}
    return;
  });

  app.action("submit_vote_button", async (props) => {
    const { ack } = props;
    const userId = props.body.user.id;
    try {
      await ack();
    } catch (err) {console.log(err)}
    const radio_button_selected =
      props.body.state.values.radio_buttons_votes.vote_radio.selected_option
        .value;
    console.log("You voted for", radio_button_selected);
    const survey = await DB.getSurvey({ surveyId: today });

    let survey_suggestions = [];
    if (survey.suggestions) {
      survey_suggestions = Object.entries(survey.suggestions);
    }

    for (let i = 0; i < survey.suggestions.length; i++) {
      if (survey.suggestions[i].placeName === radio_button_selected) {
        survey.suggestions[i].votes++;
      }
    }

    try {
      await DB.updateSurvey({
        surveyId: today,
        field: "suggestions",
        value: survey.suggestions,
      });
      
      if (survey.usersVoted) {
        await DB.updateSurvey({
          surveyId: today,
          field: "usersVoted",
          value: [...survey.usersVoted, userId]
        })
      } else {
        await DB.updateSurvey({
          surveyId: today,
          field: "usersVoted",
          value: [userId]
        })
      }
        
        updateMsgAllUsers(app, DB, userId);
    } catch (err) {console.log(err)}
  });
};
