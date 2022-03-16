const DB = require('../DB')

const welcomeMessage = async () => {
	
	const vote_options = async () => await DB.getLunchPlaceNames()
	
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
				"type": "input",
				"dispatch_action": true,
				"element": {
					"action_id": "lunch_place_txt_box",
					"type": "plain_text_input"
				},
				"label": {
					"type": "plain_text",
					"text": "Recommend where to eat:",
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
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "Italian",
								"emoji": true
							},
							"value": "value-0"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Asian",
								"emoji": true
							},
							"value": "value-1"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Mexican",
								"emoji": true
							},
							"value": "value-2"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Relaxed",
								"emoji": true
							},
							"value": "value-3"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Take-away",
								"emoji": true
							},
							"value": "value-4"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Fancy",
								"emoji": true
							},
							"value": "value-5"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Good Value",
								"emoji": true
							},
							"value": "value-6"
						}
					],
					"action_id": "multi_static_select-action"
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
						"value": "click_me_123",
						"action_id": "click_submit_suggestion"
					}
				]
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