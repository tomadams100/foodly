module.exports = function(app) {
    app.action('click_save_button', async ({ack}) => {
        await ack();
        console.log("You clicked the save button.")
    })
    app.action('set_send_msg_time', async ({ack}) => {
        await ack();
        console.log("You tried to set the time of the morning message.")
    })
    app.action('set_close_vote_time', async ({ack}) => {
        await ack();
        console.log("You tried to choose when to close the vote.")
    })
}
