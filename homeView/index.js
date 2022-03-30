const DB = require("../DB");

const homeView = async (event, client, joined) => {
  
  function objToArr (arr) {
    return newArr = arr.reduce((elem, currentValue) => {
      elem[currentValue] ? elem[currentValue]++ : elem[currentValue] = 1
      return elem
    }, {})
  }

  const workspace = await DB.getWorkspace()
  const podiumText = ``
  if (workspace.winHistory) {
    const winnersNames = objToArr(workspace.winHistory.map(elem => elem.suggestedBy))
    const winnersNamesSorted = Object.entries(winnersNames).sort((a,b) => {
      if (b[1] > a[1]) return 1
      else if (b[1] < a[1]) return -1
      else {
        if (a[0] > b[0]) return 1
        else if (a[0] < b[0]) return -1
        else return 0
      }
    }).slice(0,3)
    podiumText = `1st - ${winnersNamesSorted[0][0]} (${winnersNamesSorted[0][1]} wins) \n 2nd - ${winnersNamesSorted[1][0]} (${winnersNamesSorted[1][1]} wins) \n 3rd - ${winnersNamesSorted[2][0]} (${winnersNamesSorted[2][1]} wins)`
  } else {
    podiumText = `No winners yet.`
  }

  if (joined === false) {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Welcome to Foodly! 🍔",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Feeling hungry?* \n \n The click on the join button to get involved in the action!",
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
						text: "Join Foodly 🍔",
						emoji: true
					},
					value: event.user,
					action_id: "join_foodly"
				}
			]
		}
        ],
      },
    });
  } else {
  const getMorningMsgTime = async () => {
    const data = await DB.getWorkspace();
    return data.settings.surveyTime;
  };
  const getVoteCloseTime = async () => {
    const data = await DB.getWorkspace();
    return data.settings.winnerTime;
  };

  await client.views.publish({
    user_id: event.user,
    view: {
      type: "home",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Welcome to Foodly! 🍔",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Feeling hungry?* \n \n Head over to 'Messages' to suggest somewhere to have lunch and to vote on other people's suggestions",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🥇 *Podium* 🥇",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: podiumText,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "⚙️ *Settings*",
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "When should the morning message be sent?",
            emoji: true,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "timepicker",
              initial_time: `${await getMorningMsgTime()}`,
              placeholder: {
                type: "plain_text",
                text: "Select time",
                emoji: true,
              },
              action_id: "set_send_msg_time",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "When does voting close each day?",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "timepicker",
              initial_time: `${await getVoteCloseTime()}`,
              placeholder: {
                type: "plain_text",
                text: "Select time",
                emoji: true,
              },
              action_id: "set_close_vote_time",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Save",
                emoji: true,
              },
              value: "click_me_123",
              action_id: "click_save_button",
            },
          ],
        },
      ],
    },
  });
}
};

module.exports = homeView;
