const homeView = require(".");
const DB = require("../DB");
const moment = require('moment')
const today = moment().format("D.MM.YY");

module.exports = function (app) {
  app.action("join_foodly", async (props) => {
    const { ack } = props;
    try {
      await ack();
    } catch (err) {
      console.log(err);
    }

    try {
      const workspace = await DB.getWorkspace()
      if (workspace.users) {
        await DB.updateWorkspace({workspaceId: workspace.id, field: 'users', value: [...workspace.users, props.payload.value]})
      }
      else {
        await DB.updateWorkspace({workspaceId: workspace.id, field: 'users', value: [props.payload.value]})
      }
      let event = {user: props.payload.value}
      let client = app.client
      let joined = true
      homeView(event, client, joined)
    } catch(err) {console.log(err)}
  });

  app.action("click_save_button", async ({ ack }) => {
    await ack();
    console.log("You clicked the save button.");
  });

  app.action("set_send_msg_time", async (props) => {
    const { ack } = props;
    await ack();
    const timeSelected = props.payload.selected_time;
    console.log(
      "You tried to set the time of the morning message to: ",
      timeSelected
    );
    const workspaceId = await DB.getWorkspace();
    await DB.updateWorkspace({
      workspaceId: workspaceId.id,
      settings: { ...workspaceId.settings, surveyTime: timeSelected },
    });
  });

  app.action("set_close_vote_time", async (props) => {
    const { ack } = props;
    await ack();
    const timeSelected = props.payload.selected_time;
    console.log(
      "You tried to choose when to close the vote, close at ",
      timeSelected
    );
    const workspaceId = await DB.getWorkspace();
    await DB.updateWorkspace({
      workspaceId: workspaceId.id,
      settings: { ...workspaceId.settings, winnerTime: timeSelected },
    });
  });
};
