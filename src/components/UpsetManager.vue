<template>
  <div @mousemove="movess" @mouseup="mouseUp" ref="containerDiv">
    <!-- <svg id="matrix_svg">
      <g transform="translate(0,150)">
        <g transform="translate(50 0)">
          <HyperEdgeMatrix
            v-for="(edge, index) in hyperEdge"
            :key="'edge' + index"
            :index-col="index"
            :size="size"
            :edge-list="edge.indexArr"
            :length="length"
            :edge-question-id="edge.question"
            :edge-num="edge.num"
            :edge-option="edge.option"
            :edge-option-num="edge.option_num"
          />
        </g>
        <g>
          <QuestionNameMatrix :group-id="groupid" />
        </g>
      </g>
    </svg> -->
    <Upset v-for="(arr,index) in hyperEdgeArrList"
    :key="'upset'+JSON.stringify(arr[0])"
    :question-arr="groupArr[index]"
    :hyper-edge-arr="arr"
    :index="index"
    @dragEv="getDragEvent"
    />
    <!-- :position="getHPosition(groupArr,index)" -->
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import HyperEdgeMatrix from "./MatrixComponents/HyperEdgeMatrix.vue";
import QuestionNameMatrix from "./MatrixComponents/QuestionNameMatrix.vue";
import CardTitle from "./utilComponents/CardTitle.vue";
import Upset from './UpsetComponent/Upset.vue';
import store from '../store';
// import solveCluster from "../util/solveCluster";

export default {
  name: "matrix",
  data() {
    return {
      hyperEdge: [],
      length: 0,
      clusterState: 'yes',
      questionOnDrag: '',
      questionDragging: false,
      startPos: -1,
    };
  },
  computed: {
    size(){
      return this.$store.state.size;
    },
    groupArr() { //问题的分组以及顺序
      return this.$store.state.groupArr;
    },
    groupid() {
      return this.$store.state.selectedGroup;
    },
    questionid() {
      return this.$store.state.selectedNode;
    },
    peopleNumber() {
      return this.$store.state.peopleNumber;
    },
    hyperEdgeArrList(){
      return this.$store.state.hyperEdgeArrList;
    },
    clustersPosList() {
      const { containerDiv } = this.$refs;
      const outHeight = containerDiv.offsetParent.offsetTop;
      return [...containerDiv.childNodes].map(c => outHeight + c.offsetTop);
    }
  },
  methods: {
    movess(e){
      d3.select('#tooltip')
                .style('left', `${e.clientX + 10}px`)
                .style('top', `${e.clientY + 10}px`)
    },
    cluster(){ //mergeGroupHyperEdgeArrList   updataHyperEdgeArrList
      if (this.clusterState==='yes'){
        this.groupArrBack=this.$store.state.groupArr;
        this.$store.commit('updateGroupArr',[this.$store.state.NODE.map((x,index)=>index)])
        this.hyperEdgeArrListBack=JSON.parse(JSON.stringify(this.$store.state.hyperEdgeArrList));
        this.$store.commit('updataHyperEdgeArrList',this.$store.state.mergeGroupHyperEdgeArrList);
        this.clusterState='no'
      }
      else {
        this.$store.commit('updateGroupArr',this.groupArrBack)
        // this.questionArrBack=JSON.parse(JSON.stringify(this.$store.state.dataGroup));
        this.$store.commit('updataHyperEdgeArrList',this.hyperEdgeArrListBack)
        this.clusterState='yes'
      }
    },
    getDragEvent(ev) {
      const {name, pos} = ev;
      this.questionOnDrag = parseInt(name.split('Q')[1]);
      this.questionDragging = true;
      const startIndex = this.clustersPosList.findLastIndex(x => x <= pos);
      this.startPos = startIndex;
    },
    mouseUp(event) {
      if (this.questionDragging) {
        const endPos = this.clustersPosList.findLastIndex(x => x <= event.clientY);
        if (this.startPos != endPos) {
          this.questionDragging = false;
          // const groupArr = JSON.parse(JSON.stringify(this.$store.state.groupArr));
          const groupArr = this.$store.state.groupArr;
          groupArr[this.startPos] = groupArr[this.startPos].filter(x => x != this.questionOnDrag)
          groupArr[endPos].push(this.questionOnDrag);
          groupArr[endPos].sort((a, b) => a - b);
          // this.$store.commit("updateDataGroup", groupArr);
          this.$store.dispatch('updateDataGroupandRequestHyperEdge', groupArr);
        }
      }
    },
    // getHPosition(groupArr, index){
    //   let ans=0
    //   for (let i=0;i<index;i++){
    //     ans+=groupArr[i].length * 20 +100;
    //   }
    //   return ans;
    // },
    // initSvg() {
    //   const svg = d3
    //     .select("#matrix_svg")
    //     .append("svg")
    //     .attr("width", "100%")
    //     .attr("height", "100%");
    //   const graph = svg.append("g").attr("transform", "translate(50,0)");

    //   function zoomed({ transform }) {
    //     graph.attr(
    //       "transform",
    //       `translate(${transform.x},${transform.y})scale(${transform.k})`
    //     );
    //   }
    //   svg.call(
    //     d3
    //       .zoom()
    //       .scaleExtent([0.1, 10])
    //       .on("zoom", zoomed)
    //   );
    //   this.drawGraph = graph;
    // },

    // drawBarChart() {
    //   d3.select("#barChart").remove();
    //   //   console.log('!!!!!!!!!!!', this.hyperEdge);
    //   const barChart = d3
    //     .select("#matrix_svg")
    //     .append("g")
    //     .attr("id", "barChart")
    //     .attr("transform", "translate(50,0)");
    //   this.hyperEdge.forEach((edge, index) => {
    //     const beginX = index * this.size;
    //     let beginY = 150;
    //     const heighConst = this.$store.state.peopleNumber / 100;
    //     this.hyperEdge[index].option_num.forEach((ansernum, indexOption) => {
    //       barChart
    //         .append("rect")
    //         .attr("x", beginX)
    //         .attr("y", beginY - ansernum / heighConst)
    //         .attr("width", this.size)
    //         .attr("height", ansernum / heighConst)
    //         .attr("fill", `rgb(${this.$store.state.colorArr[indexOption]}`);
    //       beginY -= ansernum / heighConst;
    //     });
    //   });
    // },
    // updateMatrix(groupid) {
    //   const val = groupid;
    //   const URL = this.$store.state.url;
    //   this.length = this.$store.state.groupArr[val].length;
    //   axios
    //     .post(`${URL}/group`, {
    //       question: this.$store.state.groupArr[val],
    //       people: this.$store.state.peopleIndexConstraints,
    //     })
    //     .then((response) => {
    //       // console.log(
    //       //   "matrix group",
    //       //   this.$store.state.groupArr[val],
    //       //   response.data,
    //       //   solveCluster(response.data)
    //       // );
    //       const hyperEdge = response.data;
    //       //   console.log('hyperEdge', hyperEdge);
    //       for (let i = 0; i < hyperEdge.length; i += 1) {
    //         hyperEdge[i].indexArr = hyperEdge[i].question.map(
    //           (x) => this.$store.state.groupArr[val].indexOf(x),
    //           1
    //         );
    //       }
    //       this.hyperEdge = hyperEdge;
    //       this.hyperEdge.sort(
    //         (a, b) =>
    //           b.question.indexOf(this.$store.state.selectedNode) -
    //           a.question.indexOf(this.$store.state.selectedNode)
    //       );

    //       this.drawBarChart();
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    // },
    reorder() {
      this.$store.commit('reorderHyperEdge');
      this.hyperEdge.sort((a, b) => {
        if (a.dimension != b.dimension) {
          return b.dimension - a.dimension;
        } else {
          return eval(b.option_num.join("+")) - eval(a.option_num.join("+"));
          // b.num-a.num
        }
      });
    },
  },
  mounted() {
    const clusterLen=this.$store.state.groupArr.length;
    // const hyperEdge=this.hyperEdgeArr[0]
    // for (let i = 0; i < hyperEdge.length; i += 1) {
    //       hyperEdge[i].indexArr = hyperEdge[i].question.map((x) => i, 1);
    //     }
    // this.hyperEdge=hyperEdge;
    // axios
    //   .post(`${URL}/group`, {
    //     question: [],
    //     people: this.$store.state.peopleIndexConstraints,
    //   })
    //   .then((response) => {
    //     const hyperEdge = response.data;
    //     //   console.log('hyperEdge', hyperEdge);
    //     for (let i = 0; i < hyperEdge.length; i += 1) {
    //       hyperEdge[i].indexArr = hyperEdge[i].question.map((x) => i, 1);
    //     }
    //     this.hyperEdge = hyperEdge;
    //     this.hyperEdge.sort(
    //       (a, b) =>
    //         b.question.indexOf(this.$store.state.selectedNode) -
    //         a.question.indexOf(this.$store.state.selectedNode)
    //     );

    //     this.drawBarChart();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  },
  components: { HyperEdgeMatrix, QuestionNameMatrix, CardTitle,Upset },
  watch: {
    // groupid(val) {
    //   this.updateMatrix(val);
    // },
    // questionid(val) {
    //   this.hyperEdge.sort(
    //     (a, b) => b.question.indexOf(val) - a.question.indexOf(val)
    //   );
    //   this.drawBarChart();
    // },
    // peopleNumber() {
    //   this.updateMatrix(this.groupid);
    // },
  },
};
</script>

<style scoped>
#matrix_svg {
  height: 100%;
  width: 100%;
}
div {
  height: 100%;
  width: 100%;
  border: 0;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { width: 6px; background-color: rgba(204,204,204, 0.1); -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
::-webkit-scrollbar-thumb { background-color: rgba(204,204,204, 0.5); background-clip: padding-box; min-height: 28px; -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
::-webkit-scrollbar-thumb:hover { background-color: rgba(204,204,204, 1); }
</style>
