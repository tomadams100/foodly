const { getWinningPlace, updateWorkspaceOnDB } = require("./winningSuggestionMsg");

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
              googleMaps: 'www.link.com',
              placeName: "Leon",
              tags: ['Asian']
            }, 
            {
              googleMaps: 'www.link.com',
              placeName: "Pret",
              tags: ['Asian']
            }, 
            {
              googleMaps: 'www.link.com',
              placeName: "Starbucks",
              tags: ['Asian']
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
  updateWorkspace: () => {
    getWorkspace: async () => {
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
              winHistory: [{
                date: '01.01.22',
                googleMaps: 'www.link.com',
                placeName: 'Leon',
                suggestedBy: 'Tom',
                tags: ['Asian'],
                votes: 3
              }]
            }
      }
    },


    // return {
    //   settings: {
    //     surveyTime: "10:00",
    //     winnerTime: "11: 00"
    //   },
    //   suggestions: [
    //     {
    //       googleMaps: 'www.link.com',
    //       placeName: "Leon",
    //       tags: ['Asian']
    //     }, 
    //     {
    //       googleMaps: 'www.link.com',
    //       placeName: "Pret",
    //       tags: ['Asian']
    //     }, 
    //     {
    //       googleMaps: 'www.link.com',
    //       placeName: "Starbucks",
    //       tags: ['Asian']
    //     }],
    //   winHistory: [{
    //     date: '01.01.22',
    //     googleMaps: 'www.link.com',
    //     placeName: 'Leon',
    //     suggestedBy: 'Tom',
    //     tags: ['Asian'],
    //     votes: 3
    //   }]
    // }
    //}
}))

describe("fn:getWinningPlace", () => {
  it("should return the lunch location with the most votes from the day's survey", async () => {
    const winningPlace = await getWinningPlace({surveyId: "survey-exist"})
    expect(winningPlace).toEqual({
        placeName: `Leon`,
        suggestedBy: `Tom`,
        votes: 3,
      })
  })
  it("should display a place holder name if there are no suggestions yet", async () => {
    const winningPlace = await getWinningPlace({surveyId: "empty-survey"})
    expect(winningPlace).toEqual({
      placeName: "Place holder name",
      suggestedBy: "Place holder person",
      votes: 0,
    })
  })
})

describe("fn:updateWorkspaceOnDB", () => {
  it("should update the workspace on the DB with the winner from today's survey", async () => {
    const workspace = await updateWorkspaceOnDB({workspaceId: "workspace-exist" });
    expect(workspace).toEqual({
      settings: {
        surveyTime: "10:00",
        winnerTime: "11: 00"
      },
      suggestions: [
        {
          googleMaps: 'www.link.com',
          placeName: "Leon",
          tags: ['Asian']
        }, 
        {
          googleMaps: 'www.link.com',
          placeName: "Pret",
          tags: ['Asian']
        }, 
        {
          googleMaps: 'www.link.com',
          placeName: "Starbucks",
          tags: ['Asian']
        }],
      winHistory: [{
        date: '01.01.22',
        googleMaps: 'www.link.com',
        placeName: 'Leon',
        suggestedBy: 'Tom',
        tags: ['Asian'],
        votes: 3
      }]
      })
  })
})