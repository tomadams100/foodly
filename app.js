const { App } = require("@slack/bolt")
require('dotenv').config()
const homeView = require('./homeView/index')
const welcomeMessage = require('./messages/welcomeMessage')
const CronJob = require('cron').CronJob

const app = new App ({
	token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

require('./homeView/homeViewActions')(app)
// ------- GET USER IDs ------------

const allUserIds = []
const getAllUsersIds = async () => {
	const allUsers = await app.client.users.list({'token':process.env.SLACK_BOT_TOKEN})
	const allMembers = allUsers.members
	allMembers.forEach(user => {
		allUserIds.push(user.id)
		//console.log('user: ', user)
	})
	//console.log('allUserIds: ', allUserIds)
}

getAllUsersIds()

// ---------- MESSAGES ----------

let job = new CronJob('0 28 9 * * *', async () => {
	// console.log("Message should be sent")
	await allUserIds.forEach(userId => {
		app.client.chat.postMessage({
			token: process.env.SLACK_BOT_TOKEN,
			channel: userId, 
			text: welcomeMessage
		})
	})
}, null, true, 'Europe/London')
job.start()

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
