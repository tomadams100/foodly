const CronJob = require('cron').CronJob
const DB = require('../DB')
const moment = require('moment')
const sendMsgAllUsers = require('../foodlyFunctions/sendMsgAllUsers');
const today = moment().format("D.MM.YY");

const cronJob = async (app) => {
    new CronJob(`* * * * *`, async () => {
      try {
          const welcomeMessage = await require('../messages/welcomeMessage')(app)
          const welcomeMessageOptions = welcomeMessage.blocks
              let morningMsgTime = await DB.getWorkspace()
              let now = moment().format('HH:mm')
              if (now === morningMsgTime.settings.surveyTime) {
                  const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
                  for (let i = 0; i < allUserIds.length; i++) {
                      sendMsgAllUsers(app, welcomeMessageOptions, DB, today, allUserIds[i])
                  }
              }
      } catch (err) {console.log(err)}
    }, null, true, 'Europe/London').start()
}
module.exports = cronJob