/* eslint-disable no-debugger */

// let questionOption = [];
// let questionOptionNum = [];
// DATA.data.forEach((peopleAnswer) => {
//   peopleAnswer.forEach((answer, index) => {
//     if (questionOption.length <= index) {
//       questionOption.push([]);
//       questionOptionNum.push([]);
//     }
//     const pos = questionOption[index].indexOf(answer);
//     if (pos === -1) {
//       questionOption[index].push(answer);
//       questionOptionNum[index].push(1);
//     } else {
//       questionOptionNum[index][pos] += 1;
//     }
//   });
// });

// eslint-disable-next-line max-len
// const questionOptionAndNum = questionOption.map((question, qIndex) => question.map((answer, aIndex) => ({ option: answer, num: questionOptionNum[qIndex][aIndex] })));

// questionOptionAndNum.forEach((x) => x.sort((a, b) => (b.num - a.num)));
// questionOption = questionOptionAndNum.map((x) => x.map((y) => y.option));
// questionOptionNum = questionOptionAndNum.map((x) => x.map((y) => y.num));

export function bfs(graphB, nodeidX, nodeidY, DATA) {
  // debugger;
  console.log(nodeidX, nodeidY);
  const queue = [nodeidX];
  const fatherQueueOrder = [0];
  let head = 0;
  let tail = 0;
  const appearBool = new Array(DATA.nodes.length).fill(false);
  let flag = false;
  while (head <= tail) {
    const item = queue[head];
    for (let i = 0; i < DATA.nodes.length; i += 1) {
      if (graphB[item][i] !== 0 && !appearBool[i]) {
        tail += 1;
        queue[tail] = i;
        fatherQueueOrder[tail] = head;
        appearBool[i] = true;
        if (queue[tail] === nodeidY) {
          flag = true;
          break;
        }
      }
    }
    if (flag) break;
    head += 1;
  }
  if (!flag) return { sucess: flag, way: [] };
  const order = [tail];
  let temp = tail;
  let nodes = [];
  while (temp !== 0) {
    temp = fatherQueueOrder[temp];
    order.push(temp);
  }
  const way = order.map((x) => {
    nodes.push(queue[x]);
    return queue[x];
  });
  nodes = nodes.map((x) => ({ name: x }));
  const allWay = [];
  for (let i = 0; i < way.length - 1; i += 1) {
    if (graphB[way[i]][way[i + 1]] === 1) {
      allWay.push({
        target: way[i + 1],
        source: way[i],
      });
    } else {
      allWay.push({
        target: way[i],
        source: way[i + 1],
      });
    }
  }
  return {
    sucess: flag,
    way: allWay,
    nodes,
  };
}

// eslint-disable-next-line no-unused-vars
export function bfsForAllItem(nodeidList, DATAB, requiredirect = []) {
  requiredirect=[]
  if (!DATAB.nodes) return { way: [], nodes: [] };
  // if (true) return {way: DATAB.links, nodes: DATAB.nodes.map(x=>({name:x})) }
  const graph = [];
  const scoreArr = [];
  for (let i = 0; i < DATAB.nodes.length; i += 1) {
    graph.push(new Array(DATAB.nodes.length).fill(0));
    scoreArr.push(new Array(DATAB.nodes.length).fill(0));
  }
  DATAB.links.forEach((link) => {
    const { source, target, score } = link;
    // source = DATAB.nodes.indexOf(source);
    // target = DATAB.nodes.indexOf(target);
    graph[source][target] = 1;
    graph[target][source] = -1;
    scoreArr[source][target] = Number(score);
  });

  const nodeList = [];
  const requiredirectTarget = requiredirect.map((x) => Number(x[1]));
  nodeidList.forEach((x) => { if (requiredirectTarget.indexOf(x) === -1) nodeList.push(x); });
  console.log(nodeidList, nodeList, requiredirectTarget, 'nodeidlist');
  const firstNode = nodeList.shift();
  const wayList = nodeList.map((nodeId) => bfs(graph, firstNode, nodeId, DATAB));
  console.log('!!!!!!!!!!!!!!!!', wayList);
  const ans = { way: [], nodes: [] };
  requiredirect.forEach((edge) => {
    ans.nodes.push({ name: Number(edge[0]) });
    ans.nodes.push({ name: Number(edge[1]) });
    ans.way.push({
      source: Number(edge[0]),
      target: Number(edge[1]),
      score: scoreArr[edge[0]][edge[1]],
    });
  });
  // eslint-disable-next-line no-unused-vars
  wayList.forEach((bfsAns, index) => {
    if (bfsAns.sucess) {
      ans.nodes = [...ans.nodes, ...bfsAns.nodes];
      bfsAns.way.forEach((bfsAnslink) => {
        if (!ans.way.some((link) => link.source === bfsAnslink.source
          && link.target === bfsAnslink.target)) {
          const { source, target } = bfsAnslink;
          ans.way.push({ source, target, score: scoreArr[source][target] });
        }
      });
    }// else ans.nodes.push(nodeList[index]);
  });
  ans.nodes = Array.from(new Set(ans.nodes.map((x) => x.name))).map((x) => ({ name: x }));
  console.log('bfs for All', ans);
  return ans;
}

export function findH(bfsAns) {
  const { way, nodes } = bfsAns;
  const nodesName = nodes.map((x) => x.name);
  const Visit = new Array(200).fill(false);
  let flag = true;
  const hAns = [];
  const hMap = {};
  while (flag) {
    flag = false;
    const h = [];
    const VisitBack = [];
    for (let i = 0; i < nodesName.length; i += 1) {
      const thisNode = nodesName[i];
      if (!way.some((x) => x.source === thisNode && !Visit[x.target]) && !Visit[thisNode]) {
        h.push(thisNode);
        console.log('thisNode', thisNode);
        VisitBack.push(thisNode);
        flag = true;
      }
    }
    VisitBack.forEach((x) => { Visit[x] = true; });
    hAns.push(h);
  }
  if (hAns[hAns.length-1].length===0){
    nodesName.forEach(x=>{
      if (!Visit[x]) hAns[hAns.length-1].push(x)
    })
  }
  for (let h = 0; h < hAns.length; h += 1) hAns[h].forEach((id) => { hMap[id] = h; });
  return { hAns, hMap };
}
// export const questionOptionArr = questionOption;
// export const questionOptionNumArr = questionOptionNum;
// console.log(questionOptionArr, questionOptionNumArr, 'option');
