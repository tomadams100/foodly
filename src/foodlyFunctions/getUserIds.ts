// const DB = require('../DB')

import { getWorkspace } from '../DB';

export const getAllUsersIds = async (props) => {
  // contacts the DB and returns the users (an array of user IDs)
  const { workspaceId } = props;

  //console.log('propsssss', props)
  const workplace = await getWorkspace({ workspaceId });
  const allUserIds = workplace.users;
  //console.log('allUserIds', allUserIds)

  return allUserIds;
};
