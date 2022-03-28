const CronJob = require('cron').CronJob
const DB = require('../DB')
const moment = require('moment')
const sendMsgAllUsers = require('../foodlyFunctions/sendMsgAllUsers');
const today = moment().format("D.MM.YY");

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
    const welcomeMessage = await require('../messages/welcomeMessage')(app)
    const welcomeMessageOptions = welcomeMessage.blocks
        let morningMsgTime = await DB.getWorkspace()
        let now = moment().format('HH:mm')
        if (now === morningMsgTime.settings.surveyTime) {
            const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
            allUserIds.forEach(async userId => {
                sendMsgAllUsers(app, welcomeMessageOptions, DB, today, userId)
            })
        }
    }, null, true, 'Europe/London').start()
}
module.exports = cronJob