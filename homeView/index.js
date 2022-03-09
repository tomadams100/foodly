const homeView = async (event, client) => {
await client.views.publish({
    user_id: event.user,
    view: {
        "type": "home",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Welcome to Foodly! 🍔"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Feeling hungry?* \n \n Head over to 'Messages' to suggest somewhere to have lunch and to vote on other people's suggestions"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "🥇 *Podium* 🥇"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "1st - Person One (7 wins) \n 2nd - Person Two (5 wins) \n 3rd - Person Three (4 wins)"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "⚙️ *Settings*"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "When does voting close each day?"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "timepicker",
                        "initial_time": "12:00",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select time",
                            "emoji": true
                        },
                        "action_id": "actionId-0"
                    }
                ]
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Save",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "action_id": "actionId-0"
                    }
                ]
            }
        ]
    }
})
}
module.exports = homeView