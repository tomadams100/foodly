const CronJob = require('cron').CronJob
const winningSuggestionMsg = require('../messages/winningSuggestionMsg').blocks
const DB = require('../DB')
const moment = require('moment')

const cronJob = async (app) => {
    new CronJob('* * * * *', async () => {
        const closeVoteTime = await DB.getVoteCloseTime()
        let now = moment().format('HH:mm')
        if (now === closeVoteTime) {
            const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
            allUserIds.forEach(userId => {
                app.client.chat.postMessage({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: userId, 
                    text: 'Text',
                    blocks: winningSuggestionMsg
                })
            })
        }
    }, null, true, 'Europe/London').start()
}

module.exports = cronJob