const DB = require("../DB");
const moment = require("moment");
const today = moment().format("D.MM.YY");

const winngingSuggestionMsg = async () => {
  const survey = await DB.getSurvey({ surveyId: today });
  let winningPlace = {
    placeName: "some random name",
    suggestedBy: "random person",
    votes: 0,
  };
  if (survey.suggestions) {
    for (let i = 0; i < survey.suggestions.length; i++) {
      if (survey.suggestions[i].votes > winningPlace.votes) {
        winningPlace = {...survey.suggestions[i]}
      }
    }
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
          text: `The winning place is: \n ${winningPlace.placeName} \n Suggested by *${winningPlace.suggestedBy}*`,
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
