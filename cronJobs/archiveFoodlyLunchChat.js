const CronJob = require("cron").CronJob;
const DB = require("../DB");
const moment = require("moment");
const today = moment().format("D.MM.YY");

const cronJob = async (app) => {
  new CronJob(
    "0 0 * * *", async () => {
      console.log('Archive Chat')
      try {
        const survey = await DB.getSurvey({surveyId: today})
        const foodlyLunchChat = survey.foodlyLunchChat
        app.client.conversations.archive({
          channel: foodlyLunchChat,
          token: process.env.SLACK_BOT_TOKEN,
        })
      } catch (err) {console.log(err)}
    }, null, true, "Europe/London").start();
};

module.exports = cronJob;
