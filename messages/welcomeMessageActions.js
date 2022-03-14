const DB = require('../DB')

module.exports = function (app) {
    app.action('lunch_place_txt_box', async (props) => {
        const {ack} = props
        await ack();
        const placeName = props.action.value
        console.log('You typed in the lunch place name text box:', placeName)
        await DB.setLunchPlaceName({placeName})
    })

    app.action('click_submit_suggestion', async (props) => {
        //console.log('props', props)
        const { ack } = props
        await ack();
        console.log('You clicked on the submit suggestion button')
    })
}