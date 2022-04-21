import moment from 'moment';

import * as DB from '../DB';

const today = moment().format('D.MM.YY');

export const getWinningPlace = async ({ surveyId, workspaceId }) => {
  // sets up a starting winner with 0 votes, then compare each suggestion in today's survey to that to find the suggestion with the most votes
  const survey = await DB.getSurvey({ surveyId, workspaceId });
  let winningPlace = {
    placeName: 'Place holder name',
    suggestedBy: 'Place holder person',
    votes: 0,
  };
  if (survey?.suggestions) {
    for (let i = 0; i < survey.suggestions.length; i++) {
      if (survey.suggestions[i].votes > winningPlace.votes) {
        winningPlace = { ...survey.suggestions[i] };
      }
    }
  }
  console.log({ winningPlace });
  return winningPlace;
};

export const addWinningPlace = async ({workspace, winningPlace}) => {
  
  await DB.updateWorkspace({
    workspaceId: workspace.id,
    field: 'winHistory',
    value: [...workspace.winHistory || [], winningPlace]
  })
}

export const winngingSuggestionMsg = async ({
  winningPlace,
  url,
}: {
  winningPlace: any;
  url: string;
}) => {
  console.log('3');

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "Today's most popular lunch location is...",
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `The winning place is: \n ${winningPlace.placeName} with ${winningPlace.votes} votes. \n Suggested by *${winningPlace.suggestedBy}*`,
      },
      accessory: {
        type: 'image',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        image_url:
          'https://www.seekpng.com/png/small/331-3312912_lunch-information-food-plate-icon.png',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        alt_text: 'alt text for image',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'See Votes',
            emoji: true,
          },
          value: 'see_votes_button',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          action_id: 'see_votes_button',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Launch Lunch Chat',
            emoji: true,
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          action_id: 'launch_lunch_chat_button',
          url,
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Add to Google Calendar',
            emoji: true,
          },
          value: 'click_me_123', // this button has not been implemented yet
        },
      ],
    },
  ];
};