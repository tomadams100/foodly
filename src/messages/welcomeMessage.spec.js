const { getSurvey } = require("../DB");
const { welcomeMessage, vote_options, place_options } = require("./welcomeMessage");


jest.mock("../DB", () => ({
  getSurvey: async ({ surveyId }) => {
    switch (surveyId) {
      case "survey-exist":
        return {
          date: "today-date",
          suggestions: [
            {
              placeName: `Leon`,
              suggestedBy: `Tom`,
              votes: 3,
            },
          ],
          messsages: [
            {
              msgType: "survey",
              ts: `11111.1111`,
            },
          ],
          usersVoted: [`U012321321`],
          foodlyLunchChat: `C012312321`,
        };
      case "survey-not-found":
        return null;
      case "empty-survey":
        return null;
    }
  },
  createSurvey: async ({ surveyId }) => {
    return {
      date: "today-date",
    };
  },
  getWorkspace: async ({workspaceId}) => {
    switch (workspaceId) {
      case "workspace-exist":
        return {
          settings: {
            surveyTime: "10:00",
            winnerTime: "11: 00"
          },
          suggestions: [
            {
              placeName: "Leon",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }, 
            {
              placeName: "Pret",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }, 
            {
              placeName: "Starbucks",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }],
          }
      case "workspace-no-suggestions":
        return {
          settings: {
            surveyTime: "10:00",
            winnerTime: "11: 00"
          },
          suggestions: []
        }
      default:
        return {
          settings: {
            surveyTime: "10:00",
            winnerTime: "11: 00"
          },
          suggestions: [
            {
              placeName: "Leon",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }, 
            {
              placeName: "Pret",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }, 
            {
              placeName: "Starbucks",
              suggestedBy: "Tom",
              date: "01.01.2022"
            }],
          }
    }
  },
}));

describe("fn:vote_options", () => {
  it("should prompt users to suggest a place when no where is suggested yet", async () => {
    const survey = await vote_options({ surveyId: "empty-survey" });

    expect(survey).toEqual([
      {
        text: {
          type: "plain_text",
          text: `Suggest somewhere`,
          emoji: true,
        },
        value: `Suggest somewhere`,
      },
    ]);
  });

  it("should show the options to vote for when places have been suggested", async () => {
    const survey = await vote_options({ surveyId: "survey-exist" });

    expect(survey).toEqual([
      {
        text: {
          type: "plain_text",
          text: `Vote Leon 👍`,
          emoji: true,
        },
        value: `Leon`,
      },
    ]);
  });
});

describe("fn:place_options", () => {
  it("should return places from workspace suggestions if there are any", async () => {
    const options = await place_options({ surveyId: "survey-exist" })
    expect(options).toEqual([{
      text: {
        type: "plain_text",
        text: "Pret",
        emoji: true,
      },
      value: "Pret",
    },
    {
      text: {
        type: "plain_text",
        text: "Starbucks",
        emoji: true,
      },
      value: "Starbucks",
    }])
  });

  it("should return place holder when no workplace level suggestions exist", async () => {
    const options = await place_options({ surveyId: "survey-exist", workspaceId: "workspace-no-suggestions" })
    expect(options).toEqual([
      {
        text: {
          type: "plain_text",
          text: 'Place Holder Name',
          emoji: true,
        },
        value: 'Place Holder Name',
      }
    ])
  })
});
