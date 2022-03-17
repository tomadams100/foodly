const DB = require('../DB')

const welcomeMessage = async (app) => {
	
	const vote_options = async () => await DB.getLunchPlaceNames(app)
	const place_options = async () => await DB.getAllSuggestionNames()

	let selected_option = 'default'

	app.action('select_place_option', async (props) => {
        const { ack } = props
        await ack();
        console.log('You selected', props.payload.selected_option.value)
		selected_option = props.payload.selected_option.value
    })
	
	return {
		"blocks": [
			{
				"type": "header",
				"text": {
					"type": "plain_text",
					"text": "🍔 Foodly",
					"emoji": true
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"block_id": "select_place_dropdown",
				"text": {
					"type": "mrkdwn",
					"text": "Pick an item from the dropdown list"
				},
				"accessory": {
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Select an item",
						"emoji": true
					},
					"options": await place_options(),
					"action_id": "select_place_option"
				}
			},
			{
				"type": "actions",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Submit Suggestion",
							"emoji": true
						},
						"value": selected_option,
						"action_id": "click_submit_suggestion"
					}
				]
			},
			{
				"type": "divider"
			},
			{
				"type": "input",
				"dispatch_action": true,
				"element": {
					"action_id": "lunch_place_txt_box",
					"type": "plain_text_input"
				},
				"label": {
					"type": "plain_text",
					"text": "Want to suggest somewhere new?",
					"emoji": true
				}
			  },
			{
				"type": "input",
				"element": {
					"type": "plain_text_input",
					"action_id": "plain_text_input-action",
					"placeholder": {
						"type": "plain_text",
						"text": "Enter link..."
					}
				},
				"label": {
					"type": "plain_text",
					"text": "Google Maps link",
					"emoji": true
				}
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "Tag your suggestion"
				},
				"accessory": {
					"type": "multi_static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Select options",
						"emoji": true
					},
					"options": await place_options(),
					"action_id": "multi_static_select-action"
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": " *Vote Here:*"
				}
			},
			{
				"type": "actions",
				"elements": [
					{
						"type": "radio_buttons",
						"options": await vote_options(),
						"action_id": "vote_radio"
					}
				]
			}
		]
	}
}
module.exports = welcomeMessage