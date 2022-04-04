const DB = require("../DB");
const moment = require("moment");
const today = moment().format("D.MM.YY");

const command = (app) => {
  app.command('/foodly', async (props) => {
    const { ack, command, respond } = props
    await ack()
    const workspace = await DB.getWorkspace()
    let now = moment().format('HH:mm')
    console.log('workspace', workspace.settings.winnerTime)
    console.log('now', now)
    if (now < workspace.settings.winnerTime) {
      return respond({
        response_type: 'ephemeral',
        text: 'Voting is still taking place. Cast your vote to get involved!'
      })
    } else {
      console.log('display winner name')
      const survey = await DB.getSurvey({ surveyId: today });
      let winningPlace = {
        placeName: "Place holder name",
        suggestedBy: "Place holder person",
        votes: 0,
      };
      let response = ``
      if (survey.suggestions) {
        for (let i = 0; i < survey.suggestions.length; i++) {
          if (survey.suggestions[i].votes > winningPlace.votes) {
            winningPlace = {...survey.suggestions[i]}
            response = `Today's most voted suggestion ${survey.suggestions[i].placeName}`
          }
        }
        return respond({
          response_type: 'ephemeral',
          text: response
        })
      }
    }
  })
}

module.exports = command;