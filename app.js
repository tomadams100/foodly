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

// Invoke Cron Jobs
const cronJob = require('./cronJobs/morningMessage')(app)
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
