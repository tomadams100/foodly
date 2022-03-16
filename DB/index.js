const admin = require('firebase-admin');

const FieldValue = require('firebase-admin').firestore.FieldValue

const util = require('util')

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

const setLunchPlaceName = async ({placeName, app}) => {
    const data = await daily_vote_suggestions.get()
    //console.log('app', util.inspect(app, showHidden=false, depth=5, colorize=true))
    let suggestion = {place: placeName, suggestedBy: 'Tom', votes: 0}
    if (typeof data._fieldsProto !== 'undefined') {
        await daily_vote_suggestions.update({
            name: FieldValue.arrayUnion(suggestion)
        });
        const allUserIds = await require('../foodlyFunctions/getUserIds')(app)
        const welcomeMessage = await require('../messages/welcomeMessage')()
        const welcomeMessageOptions = welcomeMessage.blocks
        allUserIds.forEach(userId => {
            app.client.chat.update({
                token: process.env.SLACK_BOT_TOKEN,
                channel: userId,
                ts: '1647359394.000005',
                text:'some text',
                blocks: welcomeMessageOptions
            })
        })
        return
    }
    await daily_vote_suggestions.set({
        name: []
    });
    await daily_vote_suggestions.update({
        name: FieldValue.arrayUnion(placeName)
    });
}

const getLunchPlaceNames = async () => {
    const data = await daily_vote_suggestions.get()
    array = data._fieldsProto.name.arrayValue.values
    const vote_options_array = []
    array.forEach(element => {
		vote_options_array.push(
			{
				"text": {
					"type": "plain_text",
					"text": `Vote ${element.mapValue.fields.place.stringValue} 👍`,
					"emoji": true
				},
				"value": `${element.mapValue.fields.place.stringValue}`
			}
		)
	});
    return vote_options_array
}

const getWinningPlace = async () => {
    const data = await daily_vote_suggestions.get()
    let winningPlace = {
        place: '',
        suggestedBy: '',
        votes:0
    }
    data._fieldsProto.name.arrayValue.values.forEach(element => {
        if (element.mapValue.fields.votes.integerValue > winningPlace.votes) {
            winningPlace = {
                place: element.mapValue.fields.place.stringValue,
                suggestedBy: element.mapValue.fields.suggestedBy.stringValue,
                votes: element.mapValue.fields.votes.integerValue
            }  
        } 
    })
    //console.log('winningPlace', winningPlace)
    return winningPlace
}
getWinningPlace()

module.exports = {
    setMorningMsgTime,
    getMorningMsgTime,
    setVoteCloseTime,
    getVoteCloseTime,
    setLunchPlaceName,
    getLunchPlaceNames,
    getWinningPlace
}