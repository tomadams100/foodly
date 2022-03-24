exports.dSnapshotToObj = (dSnapshot) => {
  if (!dSnapshot.exists) {
    return null;
  }
  return {
    id: dSnapshot.id,
    ...dSnapshot.data(),
  };
};
