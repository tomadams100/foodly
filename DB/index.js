const admin = require('firebase-admin');

const FieldValue = require('firebase-admin').firestore.FieldValue

// Initialise database

admin.initializeApp({ projectId: "foodly-9d66e" });

// Define documents

const send_msg_time = admin.firestore().collection('settings').doc('send_msg_time');
const close_vote_time = admin.firestore().collection('settings').doc('close_vote_time');
const daily_vote_suggestions = admin.firestore().collection('daily_vote').doc('suggestions');


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

const setLunchPlaceName = async ({placeName}) => {
    const data = await daily_vote_suggestions.get()
    if (typeof data._fieldsProto !== 'undefined') {
        await daily_vote_suggestions.update({
            name: FieldValue.arrayUnion(placeName)
        });
        return
    }
    await daily_vote_suggestions.set({
        name: []
    });
    await daily_vote_suggestions.update({
        name: FieldValue.arrayUnion(placeName)
    });
}

module.exports = {
    setMorningMsgTime,
    getMorningMsgTime,
    setVoteCloseTime,
    getVoteCloseTime,
    setLunchPlaceName
}