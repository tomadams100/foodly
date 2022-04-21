import admin from 'firebase-admin';
import moment from 'moment';
import * as utils from './utils';

admin.initializeApp({ projectId: 'foodly-9d66e' });
const db = admin.firestore();
const today = moment().format('D.MM.YY');
import util from 'util';

export interface Survey {
  date: `${number}.${number}.${number}`;
  foodlyLunchChat: string;
  messages: Array<{ channelId: string; msgType: string; ts: string }>;
  suggestions: Array<{ placeName: string; suggestedBy: string; votes: number }>;
  usersVoted: string[];
}

export const createWorkspace = async ({workspaceId}) => {
  await db.collection('workspaces').doc(workspaceId).set({settings: {
    surveyTime: '09:00',
    winnerTime: '15:00'
  },
  suggestions: {}
});
  await createSurvey({surveyId: today, workspaceId})
  return getWorkspace({workspaceId}) 
}

// This only works for one workspace (Tom's one). Before deployment I need to make this work for multiple workspaces.
export const getWorkspace = async ({
  workspaceId,
}): Promise<{
  id: string;
  settings: { surveyTime: string; winnerTime: string };
  suggestions: {
    placeName: { googleMaps: string; placeName: string; tags: string[] };
  };
  users: string[];
  winHistory: any;
}> => {
  // console.log('Hello there, Im in the getWorkspace function')
  // const { workspaceId = "T034H9E684B" } = { ..._ }; this is the default, it's my workspace
  // typeof workspaceId === 'undefined' ? workspaceId = "T034H9E684B" : workspaceId = workspaceId
  // let workspaceId = ``
  // !props.workspaceId ? workspaceId = "T034H9E684B" : {workspaceId} = props.workspaceId
  // const {workspaceId} = props || "T034H9E684B"
  // console.log('hoooo', workspaceId)
  const _workspace = await db.collection(`workspaces`).doc(workspaceId).get();
  const workspace = utils.dSnapshotToObj(_workspace);

  return workspace;
};

export const getAllWorkspaceIds = async (): Promise<string[]> => {
  const _workspaces = await db.collection(`workspaces`).get();
  const workspaceIds = _workspaces.docs.map((workspace) => workspace.id);

  return workspaceIds;
};

export const getSurvey = async ({ surveyId, workspaceId }): Promise<Survey> => {
  const _survey = await db
    .collection(`workspaces/${workspaceId}/surveys`)
    .doc(surveyId)
    .get();
  const survey = utils.dSnapshotToObj(_survey);
  // console.log('survey returned from DB', survey)
  return survey;
};

export const createSurvey = async ({ surveyId, workspaceId }) => {
  console.log('I am inside createSurvey function');
  const ref = db.collection(`workspaces/${workspaceId}/surveys`).doc(today);
  await ref.set({ date: surveyId });

  return getSurvey({ surveyId, workspaceId });
};

export const updateSurvey = async ({
  surveyId,
  field,
  value,
  index,
  workspaceId,
}: {
  surveyId: string;
  field: string;
  value?: any;
  index?: any;
  workspaceId?: string;
}): Promise<Survey> => {
  if (index && field) {
    const ref = await db
      .collection(`workspaces/${workspaceId}/surveys`)
      .doc(surveyId)
      .update({ [field[index]]: [value] });
  } else {
    const ref = await db
      .collection(`workspaces/${workspaceId}/surveys`)
      .doc(surveyId)
      .update({ [field]: value });
  }

  return getSurvey({ surveyId, workspaceId });
};

export const updateWorkspace = async ({
  workspaceId,
  field,
  value,
  settings,
}: {
  workspaceId: string;
  field?: string;
  value?: any;
  settings?: any;
}): Promise<{
  settings: { surveyTime: string; winnerTime: string };
  suggestions: {
    placeName: { googleMaps: string; placeName: string; tags: string[] };
  };
  users: string[];
}> => {
  if (settings) {
    const ref = await db
      .collection(`workspaces`)
      .doc(workspaceId)
      .set({ settings }, { merge: true });
  }
  if (field && value) {
    const ref = await db
      .collection(`workspaces`)
      .doc(workspaceId)
      .set({ [field]: value }, { merge: true });
  }
  
  return getWorkspace({ workspaceId });
};

// createSurvey({surveyId: today, workspaceId: "T034H9E684B"})
