const DB = require('../DB')

module.exports = function (app) {
    app.action('lunch_place_txt_box', async (props) => {
        const {ack} = props
        await ack();
        const placeName = props.action.value
        console.log('You typed in the lunch place name text box:', placeName)
        await DB.setLunchPlaceName({placeName, app})
    })

    app.action('click_submit_suggestion', async (props) => {
        const { ack } = props
        await ack();
        console.log('You clicked on the submit suggestion button')
    })

    app.action('vote_radio', async (props) => {
        const { ack } = props
        await ack();
        console.log('You voted for', props.payload.selected_option.value)
    })
}