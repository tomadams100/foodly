const admin = require('firebase-admin');

// Initialise database

admin.initializeApp({ projectId: "foodly-9d66e" });

// Define documents

const send_msg_time = admin.firestore().collection('settings').doc('send_msg_time');
const close_vote_time = admin.firestore().collection('settings').doc('close_vote_time');

// Create functions

const setMorningMsgTime = async ({msgTime}) => {
    await send_msg_time.set({
    time: msgTime
    });
}

const getMorningMsgTime = async () => {
    const data = await send_msg_time.get()
    return data._fieldsProto.time.stringValue
}

const setVoteCloseTime = async ({voteCloseTime}) => {
    await close_vote_time.set({
    time: voteCloseTime
    });
}

module.exports = {
    setMorningMsgTime,
    getMorningMsgTime,
    setVoteCloseTime
}