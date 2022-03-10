const CronJob = require('cron').CronJob
const welcomeMessage = require('../messages/welcomeMessage')
const DB = require('../DB')
const moment = require('moment')

// ---------- MESSAGES ----------

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
        const morningMsgTime = await DB.getMorningMsgTime()
        let now = moment().format('HH:mm')
        if (now === morningMsgTime) {
            const allUserIds = await require('../functions/getUserIds')(app)
            allUserIds.forEach(userId => {
                app.client.chat.postMessage({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: userId, 
                    text: 'Greece tomorrow!!!' //welcomeMessage
                })
            })
        }
    }, null, true, 'Europe/London').start()

}
module.exports = cronJob