/* eslint-disable no-restricted-syntax */
export default function solveCluster(hyperEdgeList) {
  const questionsList = hyperEdgeList.map((x) => x.question);
  const participantsOptionList = hyperEdgeList.map((x) => x.participants);
  const participantsList = [];
  debugger;
  for (let i = 0; i < participantsOptionList.length; i += 1) {
    const iArr = participantsOptionList[i];
    const participants = [];
    for (let j = 0; (j < iArr.length) && (j < 3); j += 1)
      participants = participants.concat(iArr[j]);
    participantsList.push(participants);
  }
  const cluster = [];
  for (let i = 0; i < questionsList.length; i += 1) {
    cluster.push({
      questions: questionsList[i],
      participants: participantsList[i],
    });
  }
  cluster.sort((a, b) => {
    if (a.questions.length > b.questions.length) return -1;
    if (a.participants.length > b.participants.length) return -1;
    return 1;
  });

  console.log(cluster);

  const flag = new Array(cluster.length);
  flag[0] = 1;
  for (let i = 1; i < cluster.length; i += 1) {
    let FlagI = false;
    for (let j = 0; j < i; j += 1) {
      if (flag[j] === 1) {
        const Qcross = cluster[i].questions.some(
          (q) => cluster[j].questions.indexOf(q) !== -1
        );
        const Pcross = cluster[i].participants.some(
          (p) => cluster[j].participants.indexOf(p) !== -1
        );
        // if (Qcross && Pcross) FlagI = true;
        if (Pcross) FlagI=true;
      }
    }
    if (FlagI) flag[i] = 0;
    else flag[i] = 1;
  }
  console.log("flag", flag);
}



