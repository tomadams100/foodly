const admin = require("firebase-admin");
const util = require("util");
const moment = require("moment");
const utils = require("./utils");
admin.initializeApp({ projectId: "foodly-9d66e" });
const db = admin.firestore();
const today = moment().format("D.MM.YY");

const getWorkspace = async () => {
  try {
    const _workspace = await db.collection(`workspaces`).doc(`T034H9E684B`).get();
    const workspace = utils.dSnapshotToObj(_workspace);
    return workspace;
  } catch (err) {console.log(err)}
};

const getSurvey = async ({ surveyId }) => {
  try {
    const _survey = await db
      .collection(`workspaces/${process.env.WORKSPACE_ID}/surveys`)
      .doc(surveyId)
      .get();
    const survey = utils.dSnapshotToObj(_survey);
    return survey;
  } catch (err) {console.log(err)}
};

const createSurvey = async ({ date }) => {
  try {
    const ref = db
      .collection(`workspaces/${process.env.WORKSPACE_ID}/surveys`)
      .doc(today);
    await ref.set({ date });
    const surveyId = ref.id;
    return getSurvey({ surveyId });
  } catch (err) {console.log(err)}
};

const updateSurvey = async ({ surveyId, field, value, index }) => {
  try {
    if (index) {
      const ref = await db
        .collection(`workspaces/${process.env.WORKSPACE_ID}/surveys`)
        .doc(surveyId)
        .update({ [field[[index]]]: [value] });
    } else {
      const ref = await db
        .collection(`workspaces/${process.env.WORKSPACE_ID}/surveys`)
        .doc(surveyId)
        .update({ [field]: value });
    }
    return getSurvey({ surveyId });
  } catch (err) {console.log(err)}
};

const updateWorkspace = async ({ workspaceId, field, value, settings }) => {
  try {
    if (settings) {
      const ref = await db
        .collection(`workspaces`)
        .doc(workspaceId)
        .set({ settings: settings }, { merge: true });
    }
    if (field && value) {
      const ref = await db
        .collection(`workspaces`)
        .doc(workspaceId)
        .set({ [field]: value }, { merge: true });
    }
    return getWorkspace();
  } catch (err) {console.log(err)}
};

//createSurvey({ date: today });
//updateSurvey({surveyId: 'ivHBmxnJsVJ3RQ9N9Inl', field: 'date', value: '12.12.2023'})
//updateWorkspace({workspaceId: 'T034H9E684B', field: 'name', value: 'Tom Workspace'})

module.exports = {
  getWorkspace,
  getSurvey,
  createSurvey,
  updateSurvey,
  updateWorkspace,
};
