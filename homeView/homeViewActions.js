const DB = require('../DB')

module.exports = function(app) {
    app.action('click_save_button', async ({ack}) => {
        await ack();
        console.log("You clicked the save button.")
    })
    app.action('set_send_msg_time', async (props) => {
        const { ack } = props
        await ack();
        const timeSelected = props.payload.selected_time
        console.log("You tried to set the time of the morning message to: ", timeSelected)
        const workspaceId = await DB.getWorkspace()
        await DB.updateWorkspace({workspaceId:workspaceId.id, settings:{...workspaceId.settings, surveyTime: timeSelected}})
    })
    app.action('set_close_vote_time', async (props) => {
        const { ack } = props
        await ack();
        const timeSelected = props.payload.selected_time
        console.log("You tried to choose when to close the vote, close at ", timeSelected)
        const workspaceId = await DB.getWorkspace()
        await DB.updateWorkspace({workspaceId:workspaceId.id, settings:{...workspaceId.settings, winnerTime: timeSelected}})
    })
}
