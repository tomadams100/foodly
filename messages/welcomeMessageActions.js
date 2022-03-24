const DB = require("../DB");
const updateMsgAllUsers = require("../foodlyFunctions/updateMsgAllUsers");
const moment = require("moment");
const today = moment().format("D.MM.YY");

module.exports = function (app) {
  app.action("lunch_place_txt_box", async (props) => {
    const { ack } = props;
    await ack();
    const placeName = props.action.value;
    console.log("You typed in the lunch place name text box:", placeName);

    const workspace = await DB.getWorkspace();
    if (workspace.suggestions) {
      await DB.updateWorkspace({
        workspaceId: workspace.id,
        field: "suggestions",
        value: [...workspace.suggestions, placeName],
      });
    } else {
      await DB.updateWorkspace({
        workspaceId: workspace.id,
        field: "suggestions",
        value: [placeName],
      });
    }

    updateMsgAllUsers(app, DB);
  });

  app.action("click_submit_suggestion", async (props) => {
    const { ack, body } = props;
    await ack();
    console.log(
      "You clicked on the submit suggestion button to submit ",
      body.state.values.select_place_dropdown.select_place_option
        .selected_option.value
    );
    const suggestion = {
      placeName:
        body.state.values.select_place_dropdown.select_place_option
          .selected_option.value,
      suggestedBy: "Tom",
      votes: 0,
    };

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
  });

  app.action("vote_radio", async (props) => {
    const { ack } = props;
    await ack();
    return;
  });

  app.action("vote_already_submitted_button", async (props) => {
    const { ack } = props;
    await ack();
    return;
  });

  app.action("submit_vote_button", async (props) => {
    const { ack } = props;
    await ack();
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

    await DB.updateSurvey({
      surveyId: today,
      field: "suggestions",
      value: survey.suggestions,
    });
    const userHasVoted = true;
    updateMsgAllUsers(app, DB, userHasVoted);
  });
};
