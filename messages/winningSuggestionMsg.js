const DB = require('../DB')

const winngingSuggestionMsg = async () => {

	const winningPlace = await DB.getWinningPlace()

	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "Today's most popular lunch location is..."
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `The winning place is: \n ${winningPlace.place} \n Suggested by *${winningPlace.suggestedBy}*`
				},
				"accessory": {
					"type": "image",
					"image_url": "https://www.logolynx.com/images/logolynx/f0/f06b4be4626464a6a4c107b0cbbb4668.jpeg",
					"alt_text": "alt text for image"
				}
			},
			{
				"type": "divider"
			},
			{
				"type": "actions",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "See Votes",
							"emoji": true
						},
						"value": "click_me_123"
					},
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Copy Address",
							"emoji": true
						},
						"value": "click_me_123"
					},
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Add to Google Calendar",
							"emoji": true
						},
						"value": "click_me_123"
					}
				]
			}
		]
	}
}
winngingSuggestionMsg()
module.exports = winngingSuggestionMsg