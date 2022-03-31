const DB = require('../DB')

const getAllUsersIds = async (app) => {
  try {
    const workplace = await DB.getWorkspace()
    const allUserIds = workplace.users
    return allUserIds;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getAllUsersIds;
