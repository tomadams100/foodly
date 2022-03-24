const DB = require("../DB");
const moment = require("moment");
const today = moment().format("D.MM.YY");

const welcomeMessage = async (app) => {
  function diff(list1, list2) {
    return list1.filter((elem) => !list2.includes(elem));
  }

  const vote_options = async () => {
    const survey = await DB.getSurvey({ surveyId: today });
    const vote_options_array = [];
    if (!survey.suggestions || survey.suggestions.length === 0) {
      vote_options_array.push({
        text: {
          type: "plain_text",
          text: `Suggest somewhere`,
          emoji: true,
        },
        value: `Suggest somewhere`,
      });
      return vote_options_array;
    }
    for (let i = 0; i < survey.suggestions.length; i++) {
      vote_options_array.push({
        text: {
          type: "plain_text",
          text: `Vote ${survey.suggestions[i].placeName} 👍`,
          emoji: true,
        },
        value: `${survey.suggestions[i].placeName}`,
      });
    }
    return vote_options_array;
  };

  const place_options = async () => {
    const workspace = await DB.getWorkspace();
    const workspace_suggestions = workspace.suggestions;
    const survey = await DB.getSurvey({ surveyId: today });
    let survey_suggestions = [];
    if (survey.suggestions) {
      survey_suggestions = Object.entries(survey.suggestions).map(
        (elem) => elem[1].placeName
      );
    }

    const options = diff(workspace_suggestions, survey_suggestions).map(
      (elem) => {
        return {
          text: {
            type: "plain_text",
            text: elem,
            emoji: true,
          },
          value: elem,
        };
      }
    );
    return options;
  };

  let selected_option = "default";

  app.action("select_place_option", async (props) => {
    const { ack } = props;
    await ack();
    console.log("You selected", props.payload.selected_option.value);
    selected_option = props.payload.selected_option.value;
  });

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🍔 Foodly",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        block_id: "select_place_dropdown",
        text: {
          type: "mrkdwn",
          text: "Pick an item from the dropdown list",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
            emoji: true,
          },
          options: await place_options(),
          action_id: "select_place_option",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit Suggestion",
              emoji: true,
            },
            value: selected_option,
            action_id: "click_submit_suggestion",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "input",
        dispatch_action: true,
        element: {
          action_id: "lunch_place_txt_box",
          type: "plain_text_input",
        },
        label: {
          type: "plain_text",
          text: "Want to suggest somewhere new?",
          emoji: true,
        },
      },
      {
        type: "input",
        element: {
          type: "plain_text_input",
          action_id: "plain_text_input-action",
          placeholder: {
            type: "plain_text",
            text: "Enter link...",
          },
        },
        label: {
          type: "plain_text",
          text: "Google Maps link",
          emoji: true,
        },
      },
      {
        type: "section",
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
          options: await place_options(),
          action_id: "multi_static_select-action",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: " *Vote Here:*",
        },
      },
      {
        type: "actions",
        block_id: "radio_buttons_votes",
        elements: [
          {
            type: "radio_buttons",
            options: await vote_options(),
            action_id: "vote_radio",
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit Vote",
              emoji: true,
            },
            value: "value sent from submit vote button being clicked",
            action_id: "submit_vote_button",
          },
        ],
      },
    ],
  };
};
module.exports = welcomeMessage;
