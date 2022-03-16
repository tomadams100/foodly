const CronJob = require('cron').CronJob
const DB = require('../DB')
const moment = require('moment')
const util = require('util')

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
    const welcomeMessage = await require('../messages/welcomeMessage')()
    const welcomeMessageOptions = welcomeMessage.blocks
        const morningMsgTime = await DB.getMorningMsgTime()
        let now = moment().format('HH:mm')
        if (now === morningMsgTime) {
            const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
            allUserIds.forEach(async userId => {
                const msgData = await app.client.chat.postMessage({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: userId, //remove this and make it dynamic using the commented out forEach 3 lines above
                    text:'some text',
                    blocks: welcomeMessageOptions
                })
                const msgTs = msgData.ts
                const msgChannelId = msgData.channel
                const msgDataObj = {
                    ts: msgTs,
                    channelId: msgChannelId
                }
                await DB.setMsgDetails({ msgDataObj })
            })
        }
    }, null, true, 'Europe/London').start()
}
module.exports = cronJob