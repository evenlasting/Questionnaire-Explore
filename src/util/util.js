// import { NODE } from '../data/CHIGroup';
// import { CHI } from '../data/CHICOR';
// import { questionOptionArr, questionOptionNumArr } from '../data/Survey';
// import { TypeList } from '../data/Demographic';
// import { Question } from '../data/Question';
import store from '../store/index';

export function name2Id(questionName) {
  return store.state.NODE.indexOf(questionName);
}
export function id2Name(questoinId) {
  return store.state.NODE[questoinId];
}

// eslint-disable-next-line no-unused-vars
export function id2Type(questoinId) {
  return 1;
  // return store.state.TypeList[questoinId];
}

export function id2Question(questionId) {
  return store.state.Question[id2Name(questionId)];
}

export function solve2QuestionCHIbyId(questionIdX, questionIdY) {
  return store.state.CHI[questionIdX][questionIdY];
}

export function solve2QuestionCHIbyName(questoinNameX, questionNameY) {
  return solve2QuestionCHIbyId(name2Id(questoinNameX), name2Id(questionNameY));
}

export function solveAvgQuestionCHIbyId(questionId, questionIdList) {
  const CHIList = questionIdList.map((id) => solve2QuestionCHIbyId(questionId, id));
  let sum = 0;
  CHIList.forEach((CHIval) => {
    sum += CHIval;
  });
  return sum / questionIdList.length;
}

export function findQuestionOptionsbyId(questionId) {
  return store.state.questionOptionArr[questionId];
}

export function findQuestionOptionsNumbyId(questionId) {
  return store.state.questionOptionNumArr[questionId];
}

export function findQuestionOptionIdbyContext(optionContext, questionId) {
  // console.log('****', optionContext, questionId, store.state.questionOptionArr[questionId], store.state.questionOptionArr[questionId].indexOf(optionContext));
  // eslint-disable-next-line no-debugger
  return store.state.questionOptionArr[questionId].indexOf(optionContext);
}

export function id2NameandQuestion(questionId) {
  return `${id2Name(questionId)}:${id2Question(questionId)}`;
}

export function cutString(string, length = [25, 28]) {
  if (string.length < length[1]) { return { str: string, length: string.length }; }
  const sArr = string.split(' ');
  let ans = '';
  // eslint-disable-next-line guard-for-in
  for (let i = 0; i < sArr.length; i += 1) {
    ans += sArr[i];
    if (ans.length > length[0] && ans.length < length[1]) return { str: `${ans}...`, length: ans.length + 3 };
    ans += ' ';
  }
  return { str: `${string.slice(0, length[1])}...`, length: length[1] + 3 };
}


function type(obj) {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]' : 'boolean', 
    '[object Number]'  : 'number', 
    '[object String]'  : 'string', 
    '[object Function]' : 'function', 
    '[object Array]'  : 'array', 
    '[object Date]'   : 'date', 
    '[object RegExp]'  : 'regExp', 
    '[object Undefined]': 'undefined',
    '[object Null]'   : 'null', 
    '[object Object]'  : 'object'
  };
  return map[toString.call(obj)];
}


export function deepClone(data) {
  var t = type(data), o, i, ni;
  
  if(t === 'array') {
    o = [];
  }else if( t === 'object') {
    o = {};
  }else {
    return data;
  }
  
  if(t === 'array') {
    for (i = 0, ni = data.length; i < ni; i++) {
      o.push(deepClone(data[i]));
    }
    return o;
  }else if( t === 'object') {
    for( i in data) {
      o[i] = deepClone(data[i]);
    }
    return o;
  }
}