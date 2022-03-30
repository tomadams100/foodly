const DB = require("../DB");
const moment = require("moment");
const today = moment().format("D.MM.YY");

const winngingSuggestionMsg = async () => {
  const survey = await DB.getSurvey({ surveyId: today });
  let winningPlace = {
    placeName: "Place holder name",
    suggestedBy: "Place holder person",
    votes: 0,
  };
  if (survey.suggestions) {
    for (let i = 0; i < survey.suggestions.length; i++) {
      if (survey.suggestions[i].votes > winningPlace.votes) {
        winningPlace = {...survey.suggestions[i]}
      }
    }
  }
  
  const workspace = await DB.getWorkspace();
  let winnerForHistory = {}
  let alreadySavedWinner = false
  for (let i = 0; i < workspace.suggestions.length; i++) {
    if (winningPlace.placeName === workspace.suggestions[i].placeName) {
      winnerForHistory = workspace.suggestions[i]
      winnerForHistory.suggestedBy = winningPlace.suggestedBy
      winnerForHistory.votes = winningPlace.votes
      winnerForHistory.date = today
    }
  }
  if (typeof workspace.winHistory !== 'undefined') {
    for (let i = 0; i < workspace.winHistory.length; i++) {
      if (workspace.winHistory[i].date === today) alreadySavedWinner = true
    }
    if (!alreadySavedWinner) {
      if (workspace.winHistory) await DB.updateWorkspace({workspaceId: workspace.id, field: 'winHistory', value: [...workspace.winHistory, winnerForHistory]})
      else await DB.updateWorkspace({workspaceId: workspace.id, field: 'winHistory', value: [winnerForHistory]})
    }
  } else {
    await DB.updateWorkspace({workspaceId: workspace.id, field: 'winHistory', value: [winnerForHistory]})
  }

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Today's most popular lunch location is...",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `The winning place is: \n ${winningPlace.placeName} with ${winningPlace.votes} votes. \n Suggested by *${winningPlace.suggestedBy}*`,
        },
        accessory: {
          type: "image",
          image_url:
            "https://www.logolynx.com/images/logolynx/f0/f06b4be4626464a6a4c107b0cbbb4668.jpeg",
          alt_text: "alt text for image",
        },
      },
      {
        type: "divider",
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "See Votes",
              emoji: true,
            },
            value: "see_votes_button",
            action_id: "see_votes_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Copy Address",
              emoji: true,
            },
            value: "click_me_123",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Add to Google Calendar",
              emoji: true,
            },
            value: "click_me_123",
          },
        ],
      },
    ],
  };
};
winngingSuggestionMsg();
module.exports = winngingSuggestionMsg;
