const { App } = require("@slack/bolt")
require('dotenv').config()
const homeView = require('./homeView/index')

const app = new App ({
	token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

require('./homeView/homeViewActions')(app)
require('./messages/welcomeMessageActions')(app)
require('./messages/winningSuggestionMsgActions')(app)

// Invoke Cron Jobs
const morningMsgCronJob = require('./cronJobs/morningMessage')(app)
const winningSuggestionMsgCronJob = require('./cronJobs/winningSuggestionMsg')(app)
// --------- HOME ------------

app.event('app_home_opened', async ({event, client, logger}) => {
	try {
		homeView(event, client)
	}
	catch(error) {
		logger.error(error)
	}
});

module.exports = app
