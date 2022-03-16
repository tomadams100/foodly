const CronJob = require('cron').CronJob
const DB = require('../DB')
const moment = require('moment')

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
    const welcomeMessage = await require('../messages/welcomeMessage')()
    const welcomeMessageOptions = welcomeMessage.blocks
        const morningMsgTime = await DB.getMorningMsgTime()
        let now = moment().format('HH:mm')
        if (now === morningMsgTime) {
            const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
            allUserIds.forEach(userId => {
                app.client.chat.postMessage({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: userId,
                    ts: '1647359394.000005',
                    text:'some text',
                    blocks: welcomeMessageOptions
                })
            })
        }
    }, null, true, 'Europe/London').start()
}
module.exports = cronJob