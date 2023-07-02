<template>
  <div>
      <button @click="reorder">reorder</button>
      <button>cluster</button>
    <svg id="matrix_svg">
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
    </svg>
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import HyperEdgeMatrix from "./MatrixComponents/HyperEdgeMatrix.vue";
import QuestionNameMatrix from "./MatrixComponents/QuestionNameMatrix.vue";
import CardTitle from "./utilComponents/CardTitle.vue";
// import solveCluster from "../util/solveCluster";

export default {
  name: "matrix",
  data() {
    return {
      hyperEdge: [],
      size: 20,
      length: 0,
    };
  },
  computed: {
    groupid() {
      return this.$store.state.selectedGroup;
    },
    questionid() {
      return this.$store.state.selectedNode;
    },
    peopleNumber() {
      return this.$store.state.peopleNumber;
    },
  },
  methods: {
    initSvg() {
      const svg = d3
        .select("#matrix_svg")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
      const graph = svg.append("g").attr("transform", "translate(50,0)");

      function zoomed({ transform }) {
        graph.attr(
          "transform",
          `translate(${transform.x},${transform.y})scale(${transform.k})`
        );
      }
      svg.call(
        d3
          .zoom()
          .scaleExtent([0.1, 10])
          .on("zoom", zoomed)
      );
      this.drawGraph = graph;
    },

    drawBarChart() {
      d3.select("#barChart").remove();
      //   console.log('!!!!!!!!!!!', this.hyperEdge);
      const barChart = d3
        .select("#matrix_svg")
        .append("g")
        .attr("id", "barChart")
        .attr("transform", "translate(50,0)");
      this.hyperEdge.forEach((edge, index) => {
        const beginX = index * this.size;
        let beginY = 150;
        const heighConst = this.$store.state.peopleNumber / 100;
        this.hyperEdge[index].option_num.forEach((ansernum, indexOption) => {
          barChart
            .append("rect")
            .attr("x", beginX)
            .attr("y", beginY - ansernum / heighConst)
            .attr("width", this.size)
            .attr("height", ansernum / heighConst)
            .attr("fill", `rgb(${this.$store.state.colorArr[indexOption]}`);
          beginY -= ansernum / heighConst;
        });
      });
    },
    updateMatrix(groupid) {
      const val = groupid;
      const URL = this.$store.state.url;
      this.length = this.$store.state.groupArr[val].length;
      axios
        .post(`${URL}/group`, {
          question: this.$store.state.groupArr[val],
          people: this.$store.state.peopleIndexConstraints,
        })
        .then((response) => {
          const hyperEdge = response.data;
          for (let i = 0; i < hyperEdge.length; i += 1) {
            hyperEdge[i].indexArr = hyperEdge[i].question.map(
              (x) => this.$store.state.groupArr[val].indexOf(x),
              1
            );
          }
          this.hyperEdge = hyperEdge;
          this.hyperEdge.sort(
            (a, b) =>
              b.question.indexOf(this.$store.state.selectedNode) -
              a.question.indexOf(this.$store.state.selectedNode)
          );

          this.drawBarChart();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reorder(){
      this.hyperEdge.sort(
          (a, b) =>{
            if (a.dimension!=b.dimension){
              
              return b.dimension - a.dimension
            }
            else {
              return eval(b.option_num.join("+")) - eval(a.option_num.join("+"))
              // b.num-a.num
            }
          }
        );
        console.log(this.hyperEdge);
      this.drawBarChart();
    }
  },
  mounted() {
    const URL = this.$store.state.url;
    this.length = this.$store.state.groupArr[0].length;
    axios
      .post(`${URL}/group`, {
        question: [],
        people: this.$store.state.peopleIndexConstraints,
      })
      .then((response) => {
        const hyperEdge = response.data;
        //   console.log('hyperEdge', hyperEdge);
        // for (let i = 0; i < hyperEdge.length; i += 1) {
        //   hyperEdge[i].indexArr = hyperEdge[i].question.map(
        //     (x) => i,
        //     1
        //   );
        // }
        this.hyperEdge = hyperEdge;
        this.hyperEdge.sort(
          (a, b) =>
            b.question.indexOf(this.$store.state.selectedNode) -
            a.question.indexOf(this.$store.state.selectedNode)
        );

        this.drawBarChart();
        
      })
      .catch((err) => {
        console.error(err);
      });
  },
  components: { HyperEdgeMatrix, QuestionNameMatrix, CardTitle },
  watch: {
    groupid(val) {
      this.updateMatrix(val);
    },
    questionid(val) {
      this.hyperEdge.sort(
        (a, b) => b.question.indexOf(val) - a.question.indexOf(val)
      );
      this.drawBarChart();
    },
    peopleNumber() {
      this.updateMatrix(this.groupid);
    },
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
  overflow-x: scroll;
}
</style>
