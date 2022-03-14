const CronJob = require('cron').CronJob
const welcomeMessage = require('../messages/welcomeMessage').blocks
console.log('welcomeMessage: ', welcomeMessage)
const DB = require('../DB')
const moment = require('moment')

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
        const morningMsgTime = await DB.getMorningMsgTime()
        let now = moment().format('HH:mm')
        if (now === morningMsgTime) {
            const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
            allUserIds.forEach(userId => {
                app.client.chat.postMessage({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: userId,
                    text:'some text',
                    blocks: welcomeMessage
                })
            })
        }
    }, null, true, 'Europe/London').start()

}
module.exports = cronJob