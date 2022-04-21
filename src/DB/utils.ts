const dSnapshotToObj = (dSnapshot) => {
  // this function takes a response from the DB and returns and object containing an id and the data from that response
  if (!dSnapshot.exists) {
    return null;
  }
  return {
    id: dSnapshot.id,
    ...dSnapshot.data(),
  };
};

export { dSnapshotToObj };
