const { App } = require("@slack/bolt")
require('dotenv').config()
const homeView = require('./homeView/index')
const DB = require('./DB')

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


const setupDB = async () => {
	const workspace = await DB.getWorkspace()
	await DB.updateWorkspace({workspaceId: workspace.id, field: 'winHistory', value:[...workspace.winHistory, {
		date: '18.03.22',
		googleMaps: 'www.link.com',
		placeName: "Turkish Food Shop",
		suggestedBy: 'Rich',
		tags: ['Mexican', 'Asian'],
		votes: 3
	}]})
}
// setupDB()

// Invoke Cron Jobs
const morningMsgCronJob = require('./cronJobs/morningMessage')(app)
const winningSuggestionMsgCronJob = require('./cronJobs/winningSuggestionMsg')(app)
// --------- HOME ------------

app.event('app_home_opened', async ({event, client, logger}) => {
	const userId = event.user
	try {
	const workspace = await DB.getWorkspace()
		if (typeof workspace.users === 'undefined' || !workspace.users.includes(userId)) {
			let joined = false
			homeView(event, client, joined)
		}
		else if (workspace.users.includes(userId)) {
			let joined = true
			homeView(event, client, joined)
		}
	}
	catch(error) {
		logger.error(error)
	}
});

module.exports = app
