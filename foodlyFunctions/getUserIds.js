// ------- GET USER IDs ------------
const getAllUsersIds = async (app) => {
    const allUserIds = []
	const allUsers = await app.client.users.list({'token':process.env.SLACK_BOT_TOKEN})
	const allMembers = allUsers.members
	allMembers.forEach(user => {
		allUserIds.push(user.id)
		//console.log('user: ', user)
	})
	//console.log('allUserIds: ', allUserIds)
    return allUserIds
}

module.exports = getAllUsersIds