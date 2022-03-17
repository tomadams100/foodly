const admin = require('firebase-admin');

const FieldValue = require('firebase-admin').firestore.FieldValue

const util = require('util')

const moment = require('moment')

// Initialise database

admin.initializeApp({ projectId: "foodly-9d66e" });

// Define documents

const today = moment().format('D.MM.YY')

const send_msg_time = admin.firestore().collection('settings').doc('send_msg_time');
const close_vote_time = admin.firestore().collection('settings').doc('close_vote_time');
const daily_vote_suggestions = admin.firestore().collection('daily_vote').doc(`${today}`);
const messagesData = admin.firestore().collection('messagesData').doc('messages');
const suggestions = admin.firestore().collection('suggestions').doc('suggestions');

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

const setLunchPlaceName = async (props) => {
    const {placeName, app} = props
    const data = await suggestions.get()
    //let suggestion = {place: placeName, votes: 0}
    if (typeof data._fieldsProto !== 'undefined') {
        await suggestions.update({
            [placeName]: {
                suggestedBy: 'Tom',
                votes: 0
            }
        });
        const welcomeMessage = await require('../messages/welcomeMessage')(app)
        const welcomeMessageOptions = welcomeMessage.blocks
        const msgData = await messagesData.get()
        const numberOfMessages = msgData._fieldsProto.name.arrayValue.values.length
        for (let i = 0; i < numberOfMessages; i++) {
            const ts = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.ts.stringValue
            const channelId = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.channelId.stringValue
            app.client.chat.update({
                token: process.env.SLACK_BOT_TOKEN,
                channel: channelId,
                ts: ts,
                text:'some text',
                blocks: welcomeMessageOptions
            })
        }
        return
    }

    await suggestions.set({
        [placeName]: {
            suggestedBy: 'Tom',
            votes: 0
        }
    });
    // await daily_vote_suggestions.update({
    //     name: FieldValue.arrayUnion(placeName)
    // });
    const welcomeMessage = await require('../messages/welcomeMessage')(app)
    const welcomeMessageOptions = welcomeMessage.blocks
    const msgData = await messagesData.get()
    const numberOfMessages = msgData._fieldsProto.name.arrayValue.values.length
    for (let i = 0; i < numberOfMessages; i++) {
        const ts = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.ts.stringValue
        const channelId = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.channelId.stringValue
        app.client.chat.update({
            token: process.env.SLACK_BOT_TOKEN,
            channel: channelId,
            ts: ts,
            text:'some text',
            blocks: welcomeMessageOptions
        })
    }
}

const getLunchPlaceNames = async () => {
    const data = await daily_vote_suggestions.get()
    const vote_options_array = []
    if (Object.keys(data._fieldsProto).length !== 0) {    
        array = Object.keys(data._fieldsProto) //data._fieldsProto.name.arrayValue.values
        array.forEach(element => {
            vote_options_array.push(
                {
                    "text": {
                        "type": "plain_text",
                        "text": `Vote ${element} 👍`,
                        "emoji": true
                    },
                    "value": `${element}`
                }
            )
        });
    } else {
        vote_options_array.push(
            {
                "text": {
                    "type": "plain_text",
                    "text": `Suggest somewhere`,
                    "emoji": true
                },
                "value": `Suggest somewhere`
            }
        )
    } 
    return vote_options_array
}

const getWinningPlace = async () => {
    const data = await daily_vote_suggestions.get()
    let winningPlace = {
        place: '',
        suggestedBy: '',
        votes:0
    }
    // data._fieldsProto.name.arrayValue.values.forEach(element => {
    //     if (element.mapValue.fields.votes.integerValue > winningPlace.votes) {
    //         winningPlace = {
    //             place: element.mapValue.fields.place.stringValue,
    //             suggestedBy: element.mapValue.fields.suggestedBy.stringValue,
    //             votes: element.mapValue.fields.votes.integerValue
    //         }  
    //     } 
    // })
    return winningPlace
}

const setMsgDetails = async ({msgDataObj}) => {
    const data = await messagesData.get()
    if (typeof data._fieldsProto !== 'undefined') {
        await messagesData.update({
            name: FieldValue.arrayUnion(msgDataObj)
        });
        return
    }
    await messagesData.set({
        name: []
    });
    await messagesData.update({
        name: FieldValue.arrayUnion(msgDataObj)
    });
}

const getDailyVoteSuggestions = async () => {
    const data = await daily_vote_suggestions.get()
    return data
}

const incrementVotes = async (selectedOption) => {
    const data = await daily_vote_suggestions.get()
    // for (let i = 0; i < data._fieldsProto.name.arrayValue.values.length; i++) {
        // if (data._fieldsProto.name.arrayValue.values[i].mapValue.fields.place.stringValue === selectedOption) {
            //data._fieldsProto.name.arrayValue.values[i].mapValue.fields.votes.integerValue
            // await daily_vote_suggestions.update({
            //     //name: FieldValue.increment(1)
            // })
        // }
    // }
}
//incrementVotes('test')

const getAllSuggestionNames = async () => {
    const data = await suggestions.get()
    const names = Object.keys(data._fieldsProto)
    const options = []
    for (let i = 0; i < names.length; i++) {
        options.push({
            "text": {
                "type": "plain_text",
                "text": names[i],
                "emoji": true
            },
            "value": names[i]
        })
    }
    return options
}
// Daily vote --------------------------
const submitSuggestion = async (props) => {
    const {suggestion, app} = props
    console.log('You want to publish this to the DB:', suggestion)
    const data = await daily_vote_suggestions.get()

    if (typeof data._fieldsProto !== 'undefined') {
        await daily_vote_suggestions.update({
            [suggestion.placeName]: {
                suggestedBy: suggestion.suggestedBy,
                votes: suggestion.votes
            }
        });

        const welcomeMessage = await require('../messages/welcomeMessage')(app)
        const welcomeMessageOptions = welcomeMessage.blocks
        const msgData = await messagesData.get()
        const numberOfMessages = msgData._fieldsProto.name.arrayValue.values.length
        for (let i = 0; i < numberOfMessages; i++) {
            const ts = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.ts.stringValue
            const channelId = msgData._fieldsProto.name.arrayValue.values[i].mapValue.fields.channelId.stringValue
            app.client.chat.update({
                token: process.env.SLACK_BOT_TOKEN,
                channel: channelId,
                ts: ts,
                text:'some text',
                blocks: welcomeMessageOptions
            })
        }

        return
    }
    await daily_vote_suggestions.set({
        [suggestion.placeName]: {
            suggestedBy: suggestion.suggestedBy,
            votes: suggestion.votes
        }
    });
}

module.exports = {
    setMorningMsgTime,
    getMorningMsgTime,
    setVoteCloseTime,
    getVoteCloseTime,
    setLunchPlaceName,
    getLunchPlaceNames,
    getWinningPlace,
    setMsgDetails,
    getDailyVoteSuggestions,
    incrementVotes,
    getAllSuggestionNames,
    submitSuggestion
}