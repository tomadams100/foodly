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
                    "text": "Welcome"
                }
            }
        ]
    }
})
}
module.exports = homeView