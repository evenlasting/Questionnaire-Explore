<template>
  <div translate="10px -100px" :style="'margin-top:30px;display:flex;' + 'height: ' + (svgHeight + size * 2-40) + 'px;' + 'width: 780px;border:solid 1px #ccc;border-radius: 4px; z-index:-1'">
    <svg :style="'height:' + svgHeight + ';width: 40px'">
      <g :id="'questionName' + index">
        <text
          v-for="(name, nameIndex) in nameArr"
          :key="'questionName' + index + nameIndex"
          :transform="
            'translate(0 ' + ((nameIndex + 0.5) * size + barChartHeight) + ')'
          "
          @mousedown="nameDrag(name, $event)"
          @mousemove="tooltip(name, $event)"
          @mouseleave="tooltipleave(name)"
          @click="nameClick(name)"
        >
          {{ name }}
        </text>
      </g>
    </svg>
    <div
      :style="
        'height: ' +
          (svgHeight + size) +
          'px ; width: calc(100%); overflow-x: hidden; overflow-y: hidden'
      "
    >
      <svg :style="'height:' + svgHeight + ';width: ' + svgWidth">
        <g :id="'background' + index">
          <rect
            v-for="(_, nameIndex) in nameArr"
            :key="'back' + nameIndex + '/' + index"
            :transform="
              'translate(' +
                0 +
                ' ' +
                ((nameIndex - 0.3) * size + barChartHeight) +
                ')'
            "
            :height="size"
            width="9999"
            :fill="nameIndex % 2 === 1 ? '\#F4F4F4' : '\#FFF'"
          />
        </g>
        <g :id="'barChart' + index" transform="translate(0,90)">
          <rect
            v-for="(hyperEdge, hyperIndex) in hyperEdgeArr"
            :key="'hyperBar' + hyperIndex + '/' + index"
            :width="size * 0.6"
            :height="hyperEdge.num / 10"
            :x="hyperIndex * size + 0.2 * size"
            :y="-hyperEdge.num / 10"
            fill="black"
          />
        </g>
        <g
          :id="'matrix' + index"
          :transform="
            'translate(' +
              size * 0.5 +
              ' ' +
              (barChartHeight + 0.2 * size) +
              ')'
          "
        >
          <QuestionCombination
            v-for="(combination, combinationIndex) in hyperEdgeArr"
            :key="'combination' + index + '/' + JSON.stringify(combination.question)"
            :hyper-edge="combination"
            :question-arr="questionArr"
            :groupid="index"
            :combination-index="combinationIndex"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import * as util from "../../util/util";
import QuestionCombination from "./QuestionCombination.vue";

import { bfsForAllItem, findH } from "../../data/Survey";

import * as d3 from 'd3';
import Vue from "vue";
export default {
  components: { QuestionCombination },
  name: "upset",
  props: ["questionArr", "index", "hyperEdgeArr"],
  data() {
    return {
      barChartHeight: 100,
      alterNode: -1,
    };
  },
  watch: {},
  computed: {
    questionid() {
      return this.$store.state.selectedNode;
    },
    size() {
      return this.$store.state.size;
    },
    svgHeight() {
      return (
        this.$store.state.groupArr[this.index].length * this.size +
        this.barChartHeight
      );
    },
    svgWidth() {
      return this.hyperEdgeArr.length * this.size;
    },
    tooltipTransform() {
      return `translate(50  ${this.tooltipTransformY})`;
    },
    nameArr() {
      const { state } = this.$store;
      //   return state.groupArr[this.groupId].map(
      //     (x) => state.Question[state.NODE[x]],
      return state.groupArr[this.index].map((x) => state.NODE[x]);
    },
  },
  mounted() {},
  methods: {
    tooltipleave(name){
      if (name==='Q16') return;
      d3.select('#tooltip').style('display', 'none');
      
    },
    tooltip(name,e){
      const text=util.id2NameandQuestion(parseInt(name.slice (1)))
      d3.select('#tooltip')
                .style('left', `${e.clientX + 10}px`)
                .style('top', `${e.clientY + 10}px`)
                .style('z-index', 20)
                .style('display', 'inline')
                .text(text);
    },
    nameDrag(name, event) {
      this.$emit('dragEv', {name, pos: event.clientY});
    },
    nameClick(name) {
      const size = [];
      const randomSize = [];
      this.hyperEdgeArr.forEach((hyperEdge) => {
        if (hyperEdge.question.length === 3) {
          size.push(
            bfsForAllItem(hyperEdge.question, this.$store.state.causalDATA, [])
              .nodes.length
          );
          const question = [];
          while (question.length < 3) {
            const newq = Math.floor(Math.random() * 17);
            if (question.indexOf(newq) === -1) question.push(newq);
          }
          randomSize.push(
            bfsForAllItem(question, this.$store.state.causalDATA, []).nodes
              .length
          );
        }
      });
      console.log(
        "size",
        size,
        eval(size.join("+")) / size.length,
        randomSize,
        eval(randomSize.join("+")) / randomSize.length
      );
      this.$store.dispatch("selectNodeinGraph", util.name2Id(name));
    },
  },
};
</script>

<style scoped>

svg text {
  cursor: pointer;
}

svg text::selection {
  background: none;
}

</style>
