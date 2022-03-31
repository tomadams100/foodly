const DB = require('../DB')
const moment = require("moment");
const updateMsgAllUsers = require('../foodlyFunctions/updateMsgAllUsers');
const updateWinningMsgAllUsers = require('../foodlyFunctions/updateWinningMsgAllUsers');
const today = moment().format("D.MM.YY");
const todayForChannelName = today.replaceAll('.', '-')

module.exports = function (app) {
  app.action('see_votes_button', async (props) => {
    const { ack, client, body } = props
    await ack()

    const survey = await DB.getSurvey({surveyId: today})
    let text = `*Votes* \n \n`
    const suggestions_vote_order = [...survey.suggestions].sort((a, b) => 
    {
      if ( a.votes < b.votes ){
        return 1;
      }
      if ( a.votes > b.votes ){
        return -1;
      }
      return 0
    })

    for (let i = 0; i < suggestions_vote_order.length; i++) {
      text += `${suggestions_vote_order[i].votes} votes - ${suggestions_vote_order[i].placeName}\n`
    }

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Modal title'
        },
      title: {
        type: "plain_text",
        text: "Votes"
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text
          }
        }
      ],
    }})
  })

  app.action('launch_lunch_chat_button', async (props) => {
    const { ack, client } = props
    const survey = await DB.getSurvey({surveyId: today})
    const usersVoted = survey.usersVoted.join(', ')
    try {
      if (!survey.foodlyLunchChat) {
        await ack()
        const foodlyLunchChat = await client.conversations.create({
          token: process.env.SLACK_BOT_TOKEN,
          name: `foodly-lunch-chat-${todayForChannelName}`
        })
        await DB.updateSurvey({surveyId: today, field: 'foodlyLunchChat', value: foodlyLunchChat.channel.id})
        await client.conversations.invite({
          channel: foodlyLunchChat.channel.id,
          users: usersVoted,
          token: process.env.SLACK_BOT_TOKEN
        })
        updateWinningMsgAllUsers(app, DB)
      } else {
        await ack()
      }
    } catch (err) {
      await ack()
      console.log(err)
    }
  })
}