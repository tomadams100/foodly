const admin = require('firebase-admin');

// Initialise database

admin.initializeApp({ projectId: "foodly-9d66e" });

// Define documents

const send_msg_time = admin.firestore().collection('settings').doc('send_msg_time');
const close_vote_time = admin.firestore().collection('settings').doc('close_vote_time');


// Check to see if the database is blank

const checkIfDBBlank = async () => {
    const send_msg_data = await send_msg_time.get()
    const close_vote_data = await close_vote_time.get()
    if ((!send_msg_data._fieldsProto) && (!close_vote_data._fieldsProto)) {
        initialiseDB()
    }
}
checkIfDBBlank()

// Initialise database

const initialiseDB = async () => {
    await send_msg_time.set({
        time: ""
    })
    await close_vote_time.set({
        time: ""
    })
}

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

const getVoteCloseTime = async () => {
    const data = await close_vote_time.get()
    return data._fieldsProto.time.stringValue
}

module.exports = {
    setMorningMsgTime,
    getMorningMsgTime,
    setVoteCloseTime,
    getVoteCloseTime
}