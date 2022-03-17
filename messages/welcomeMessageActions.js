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
        const { ack, body } = props
        await ack();
        console.log('You clicked on the submit suggestion button to submit ', body.state.values.select_place_dropdown.select_place_option.selected_option.value)
        const suggestion = {
            placeName: body.state.values.select_place_dropdown.select_place_option.selected_option.value,
            suggestedBy: 'Tom',
            votes: 0
        }
        DB.submitSuggestion({suggestion, app})
    })

    app.action('vote_radio', async (props) => {
        const { ack } = props
        await ack();
        console.log('You voted for', props.payload.selected_option.value)
        data = await DB.getDailyVoteSuggestions()
        for (let i = 0; i < data._fieldsProto.name.arrayValue.values; i++) {
            if (data._fieldsProto.name.arrayValue.values[i].mapValue.fields.place.stringValue === props.payload.selected_option.value) {
                const selected_option = props.payload.selected_option.value
                await DB.incrementVotes(selected_option)
                return
            }
        }
    })
}