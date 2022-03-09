const welcomeMessage = {
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
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action",
				"placeholder": {
					"type": "plain_text",
					"text": "Where do you want to eat?"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Suggest a lunch place!",
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
					"action_id": "actionId-0"
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
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Leon"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Vote Leon 👍",
					"emoji": false
				},
				"value": "option_1",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Wasabi"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Vote Wasabi 👍",
					"emoji": false
				},
				"value": "option_2",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Pizza Pilgrims"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Vote PP 👍",
					"emoji": false
				},
				"value": "option_3",
				"action_id": "button-action"
			}
		}
	]
}

module.exports = welcomeMessage