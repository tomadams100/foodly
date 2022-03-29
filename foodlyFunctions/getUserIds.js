const DB = require('../DB')

const getAllUsersIds = async (app) => {
  try {
    const workplace = await DB.getWorkspace()
    const allUserIds = workplace.users
    // const allUsers = await app.client.users.list({
    //   token: process.env.SLACK_BOT_TOKEN,
    // });
    // const allMembers = allUsers.members;
    // allMembers.forEach((user) => {
    //   console.log(user.is_bot, user.name);
    //   if (!user.is_bot) {
    //     allUserIds.push(user.id);
    //   }
    // });
    console.log({ allUserIds });
    return allUserIds;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getAllUsersIds;
