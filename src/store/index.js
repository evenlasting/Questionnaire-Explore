/* eslint-disable no-debugger */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fullScreenLoading: true,
    CHIGroup: [],
    NODE: [],
    size: 20,
    Question: [],
    selectedGroup: -1,
    selectedNode: -1,
    // url: 'http://49.235.219.243:5000',
    // url: 'http://10.172.142.37:5000',
    url: "http://172.21.97.243:5000/",
    causeUrl: "http://10.172.142.37:5001",
    // url: "http://10.76.5.129:9999/",
    // causeUrl: "http://10.76.5.129:9999/",
    groupArr: [],
    maxQuestionNumber: 3,
    selectedHyperEdge: [1, 2],
    hyperEdgeArrList: [],
    peopleNumber: 0,
    CHI: [],
    COR: [],
    demographicCol: "#edf8b1",
    coreProblemCol: "#00ff33",
    normalProblemCol: "#50A5FF",
    problemColArr: ["#edf8b1", "#50A5FF", "#00ff33"],
    colorArr: [
      "251,180,174",
      "204,235,197",
      "222,203,228",
      "206,172,175",
      "190,219,183",
      "207,205,222",
      "254,217,166",
      "255,255,204",
      "229,216,189",
      "179,205,227",
    ],
    questionTypeList: [], // TypeList,
    questionOption: [],
    questionOptionNum: [],
    delNodeList: [],
    selectedHyperEdgeBack: [],
    screenCenterQuestionId: 1,
    nodesConnections: [],
    questionOptionArr: [],
    questionOptionNumArr: [],
    causalDATA: {},
    causalConstraints: {},
    causalAddNode: [],
    peopleIndexConstraints: [],
    CHIBACK: [],
    nodesConnectionsBACK: [],
    causalAll: false,
    bicluster: [],
    updatingCausality: false,
  },
  mutations: {
    updateGroupArr(state,groupArr){
      state.groupArr=groupArr
    },
    mergeQuestions(state){

    },
    clusterQuestions(state){

    },
    reorderHyperEdge(state) {
      state.hyperEdgeArrList.forEach((hyperEdgeArr) => {
        hyperEdgeArr.sort((a, b) => {
          if (a.dimension != b.dimension) {
            return b.dimension - a.dimension;
          } else {
            // return eval(b.option_num.join("+")) - eval(a.option_num.join("+"));
            return b.num - a.num;
          }
        });
      });
    },
    updateMaxQuestionNumber(state, maxQuestionNumber) {
      state.maxQuestionNumber = maxQuestionNumber;
    },
    updateCausalAll(state, causalAll) {
      state.causalAll = causalAll;
    },
    updatePeopleIndexConstraints(state, peopleIndexConstraints) {
      state.peopleIndexConstraints = peopleIndexConstraints;
    },
    updateCausalConstraints(state, causalConstraints) {
      state.causalConstraints = causalConstraints;
    },
    updateCausalAddNode(state, causalAddNode) {
      state.causalAddNode = causalAddNode;
    },
    updateCausalDATA(state, causalDATA) {
      state.causalDATA = causalDATA;
      state.updatingCausality=false;
    },
    updateLoading(state, loading) {
      state.fullScreenLoading = loading;
    },
    UpdateSurvey(state, surveyResponse) {
      const {
        newCHI,
        newCHIGroup,
        newNODE,
        newQuestion,
        newTypeList,
        newNodesConnections,
        newPeopleNumber,
        newOption,
        newOptionNum,
        bicluster,
      } = surveyResponse;
      state.bicluster = bicluster;
      state.peopleNumber = newPeopleNumber;
      state.CHIGroup = newCHIGroup;
      state.NODE = newNODE;
      state.Question = newQuestion;
      state.CHI = newCHI;
      state.questionTypeList = newTypeList;
      state.groupArr = newCHIGroup.map((arr) => arr.map((data) => data[0]));
      state.nodesConnections = newNodesConnections;
      state.questionOptionArr = newOption;
      state.questionOptionNumArr = newOptionNum;
      state.CHIGroupBack = JSON.parse(JSON.stringify(newCHIGroup));
    },
    updataCHIGroup(state, CHIGroup) {
      state.CHIGroup = CHIGroup;
      state.groupArr = CHIGroup.map((arr) => arr.map((data) => data[0]));
    },
    hyperEdgeBack(state, selectedHyperEdgeBack) {
      state.selectedHyperEdgeBack = selectedHyperEdgeBack;
    },
    // 保存当前菜单栏的路径
    selectNode(state, NodeId) {
      state.hyperEdgeArrList.forEach((hyperEdgeArr) => {
        hyperEdgeArr.sort(
          (a, b) => b.question.indexOf(NodeId) - a.question.indexOf(NodeId)
        );
      });
      state.selectedNode = NodeId;
    },
    selectGroup(state, GroupId) {
      state.selectedGroup = GroupId;
    },
    selectHyperEdge(state, hyperArr) {
      // hyperEdge, questionOption, questionOptionNum) {
      [
        state.selectedHyperEdge,
        state.questionOption,
        state.questionOptionNum,
      ] = hyperArr;
    },
    delNode(state, NodeId) {
      //   let groupId;
      //   let nodeId;
      //   state.CHIGroup.forEach((group, index) => {
      //     group.forEach((nodeCHI, indexCHI) => {
      //       if (nodeCHI[0] === NodeId) {
      //         groupId = index;
      //         nodeId = indexCHI;
      //       }
      //     });
      //   });
      //   state.delNodeList.push(NodeId);
      //   state.CHIGroup[groupId].splice(nodeId, 1);
      //   state.groupArr[groupId].splice(nodeId, 1);
      state.selectedHyperEdgeBack.splice(
        state.selectedHyperEdgeBack.indexOf(NodeId),
        1
      );
      state.selectedHyperEdge = state.selectedHyperEdgeBack;
    },
    addNode(state, NodeId) {
      state.selectedHyperEdge.push(NodeId);
    },
    commitScreenCenterQuestionId(state, screenCenterQuestionId) {
      state.screenCenterQuestionId = screenCenterQuestionId;
    },
    UpdateSurveyBack(state, surveyResponse) {
      const {
        newCHI,
        newNodesConnections,
        newPeopleNumber,
        newOption,
        newOptionNum,
      } = surveyResponse;
      state.peopleNumber = newPeopleNumber;
      // state.CHIGroup = newCHIGroup;
      // state.NODE = newNODE;
      // state.Question = newQuestion;
      state.CHIBACK = newCHI;
      // state.questionTypeList = newTypeList;
      // state.groupArr = newCHIGroup.map((arr) => arr.map((data) => data[0]));
      state.nodesConnectionsBACK = newNodesConnections;
      state.questionOptionArr = newOption;
      state.questionOptionNumArr = newOptionNum;
      // state.CHIGroupBack = JSON.parse(JSON.stringify(newCHIGroup));
    },
    updateDataGroup(state, dataGroup) {
      state.dataGroup = dataGroup;
    },
    updataHyperEdgeArrList(state, hyperEdgeArrList) {
      state.hyperEdgeArrList = hyperEdgeArrList;
      // console.log('!!!',hyperEdgeArr,state.hyperEdgeArr)
    },
    beginUpdatingCausality(state){
      state.updatingCausality=true;
    },
    updateMergeGroupHyperEdgeArrList(state, mergeGroupHyperEdgeArrList){
      state.mergeGroupHyperEdgeArrList=mergeGroupHyperEdgeArrList;
    }
  },
  actions: {
    /**
     * datagroup: [[1,2],[3,4]] a arr of question id
     */
    updateDataGroupandRequestHyperEdge({ commit, state, dispatch }, datagroup) {
      commit("updateDataGroup", datagroup);
      dispatch('updateMergeGroupHyperEdge');
      Promise.all(
        datagroup.map(async (questionList, index) => {
          return axios.post(`${state.url}/group`, {
            question: questionList,
            people: state.peopleIndexConstraints,
          });
        })
      ).then((hyperEdgeArrList) => {
        commit("updataHyperEdgeArrList", hyperEdgeArrList.map((res) => res.data));
        commit("updateLoading", false); // 最后一步请求数据，解除加载状态
      });
    },
    updateMergeGroupHyperEdge({commit,state}){
      const datagroup=[state.NODE.map((x,index)=>index)]
      Promise.all(
        datagroup.map(async (questionList, index) => {
          return axios.post(`${state.url}/group`, {
            question: questionList,
            people: state.peopleIndexConstraints,
          });
        })
      ).then((hyperEdgeArrList) => {
        commit("updateMergeGroupHyperEdgeArrList", hyperEdgeArrList.map((res) => res.data));
      });
    },
    dataRequestContraints({ commit, state, dispatch }, peopleIndexConstraints) {
      const { url } = state;
      commit("updatePeopleIndexConstraints", peopleIndexConstraints);
      axios
        .post(`${url}/survey`, {
          question: [],
          people: peopleIndexConstraints,
        })
        .then((response) => {
          dispatch("causalDATARequest").then(() => {
            commit("UpdateSurveyBack", response.data);
            console.log("finish constraints request");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    causalDATARequest(
      { commit, state },
      payload = {
        requiredirect: [],
        forbiddendirect: [],
        target: [],
        source: [],
      }
    ) {
      commit('beginUpdatingCausality')
      const { url } = state;
      const { requiredirect, forbiddendirect, source, target } = payload;
      console.log({
        r: requiredirect,
        f: forbiddendirect,
      });
      let t = [];
      if (source.length !== 0)
        t.push(source.map(x=>x.toString())); //return store.state.NODE.indexOf(questionName);
      let midNode = [];

      state.NODE.forEach((name,index) => {
        if (target.indexOf(index) === -1 && source.indexOf(index) === -1)
          midNode.push(index.toString());
      });
      t.push(midNode);
      if (target.length !== 0)
        t.push(target.map(x=>x.toString()));
      // t=[['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'],['16']];
      axios
        .post(`${url}/cause`, {
          r: requiredirect.map(x=>x.map(xx=>xx.toString())),
          f: forbiddendirect.map(x=>x.map(xx=>xx.toString())),
          t: t.map(x=>x.map(xx=>xx.toString())),
        })
        .then((response) => {
          commit("updateCausalDATA", response.data);
        })
        .catch((error) => console.error(error));
    },
    selectNodeinGraph({ commit, state }, NodeId) {
      commit("selectNode", NodeId);
      for (let i = 0; i < state.CHIGroup.length; i += 1) {
        if (state.CHIGroup[i].some((x) => x[0] === NodeId)) {
          commit("selectGroup", i);
        }
      }
    },
    dataRequest(
      { commit, state, dispatch },
      questionIdArr = [],
      peopleIndexArr = []
    ) {
      const { url } = state;
      axios
        .post(`${url}/survey`, {
          question: questionIdArr,
          people: peopleIndexArr,
        })
        .then((response) => {
          dispatch("causalDATARequest").then(() => {
            commit("UpdateSurvey", response.data);
            dispatch(
              "updateDataGroupandRequestHyperEdge",
              response.data.newCHIGroup.map((arr) => arr.map((data) => data[0]))
            );
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
