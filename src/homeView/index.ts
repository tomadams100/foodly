export const homeView = async ({ event, client, joined, workspace }) => {
  function objToArr(arr) {
    // converts and object to an array
    return arr.reduce((elem, currentValue) => {
      elem[currentValue] ? elem[currentValue]++ : (elem[currentValue] = 1);
      return elem;
    }, {});
  }
  // get the workspace and search through the winHistory (ie people who've won the vote) and find the 3 users with the most wins
  // const workspace = await DB.getWorkspace({workspace})
  let podiumText = ``;
  if (workspace?.winHistory && workspace?.winHistory.length >= 3) {
    // console.log('workspace.winHistory.length', workspace.winHistory.length)
    const winnersNames = objToArr(
      workspace.winHistory.map((elem) => elem.suggestedBy),
    );
    const winnersNamesSorted = Object.entries(winnersNames) // TODO define the structure of winnersNames
      .sort((a: any, b: any) => {
        if (b[1] > a[1]) return 1;
        else if (b[1] < a[1]) return -1;
        else {
          if (a[0] > b[0]) return 1;
          else if (a[0] < b[0]) return -1;
          else return 0;
        }
      })
      .slice(0, 3);
    podiumText = `1st - ${winnersNamesSorted[0][0]} (${winnersNamesSorted[0][1]} wins) \n 2nd - ${winnersNamesSorted[1][0]} (${winnersNamesSorted[1][1]} wins) \n 3rd - ${winnersNamesSorted[2][0]} (${winnersNamesSorted[2][1]} wins)`
  } else {
    podiumText = `Not enough winners yet for a podium.`;
  }

  if (joined === false) {
    // if the userId is not found in the DB workspace collection, then show them a button prompting them to 'join'
    await client.views.publish({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to Foodly! 🍔',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Feeling hungry?* \n \n The click on the join button to get involved in the action!',
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
                  text: 'Join Foodly 🍔',
                  emoji: true,
                },
                value: event.user,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'join_foodly',
              },
            ],
          },
        ],
      },
    });
  } else {
    // these functions contact the database to find the time the survey is sent and the time the winner message is sent
    const getMorningMsgTime = async () => {
      // console.log({body})
      // let workspaceId = {}

      // if (body?.user?.team_id) {
      //   workspaceId = body.user.team_id
      // } else if (body?.team_id) {
      //   workspaceId = body.team_id
      // } else {
      //   workspaceId = body.user.team_id
      // }

      // const data = await DB.getWorkspace({workspaceId: workspaceId});
      // console.log('workspace', workspace)
      // console.log('morning ', workspace.settings.surveyTime);
      return workspace.settings.surveyTime; // data?.settings.surveyTime;
    };

    const getVoteCloseTime = async () => {
      // let workspaceId = {}

      // if (body?.user?.team_id) {
      //   workspaceId = body.user.team_id
      // } else if (body?.team_id) {
      //   workspaceId = body.team_id
      // } else {
      //   workspaceId = body.user.team_id
      // }
      // const data = await DB.getWorkspace({workspaceId: workspaceId});
      // return data?.settings.winnerTime;

      // console.log('getVoteCloseTime ', workspace.settings.winnerTime);
      return workspace.settings.winnerTime;
    };

    await client.views.publish({
      // if the user has clicked the join button in the past then show the normal home screen
      // eslint-disable-next-line @typescript-eslint/naming-convention
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to Foodly! 🍔',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "*Feeling hungry?* \n \n Head over to 'Messages' to suggest somewhere to have lunch and to vote on other people's suggestions",
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '🥇 *Podium* 🥇',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: podiumText,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '⚙️ *Settings*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'When should the morning message be sent?',
              emoji: true,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'timepicker',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                initial_time: await getMorningMsgTime(), // calls a function to contact the DB and find what time has been saved to send the morning message
                placeholder: {
                  type: 'plain_text',
                  text: 'Select time',
                  emoji: true,
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'set_send_msg_time',
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'When does voting close each day?',
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'timepicker',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                initial_time: await getVoteCloseTime(), // calls a function to contact the DB and find what time has been saved to send the winner message
                placeholder: {
                  type: 'plain_text',
                  text: 'Select time',
                  emoji: true,
                },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'set_close_vote_time',
              },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Save',
                  emoji: true,
                },
                value: 'click_me_123',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                action_id: 'click_save_button',
              },
            ],
          },
        ],
      },
    });
  }
};
