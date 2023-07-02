<template>
    <g id="hyper" :transform="'translate('+this.translateX+' 0)'">
        <!-- <rect
            v-for="(item,index) in renderArr"
            :key="'hype'+index+'/'+indexCol+'/'+item"
            :transform="'translate(0 ' + index*size+')'"
            :width="size"
            :height="size"
            :class="'noQuestion'"
            /> -->
        <rect
            v-for="(item,index) in renderArr"
            :key="'hype'+index+'/'+indexCol+'/'+item"
            :transform="'translate(0 ' + index*size+')'"
            :width="size"
            :height="size"
         :fill="item"
            @click="selectHyperEdge(indexCol,index)"
        />

    </g>
</template>

<script>
import Vue from 'vue';
import * as d3 from 'd3';
import * as util from '../../util/util';

export default {
  name: 'hyper-edge-matrix',
  props: [
    'left',
    'top',
    'size',
    'edgeList',
    'indexCol',
    'length',
    'edgeQuestionId',
    'edgeNum',
    'edgeOption',
    'edgeOptionNum',
  ],
  data() {
    return {
      groupid: this.$store.state.selectedGroup,
      translateX: this.indexCol * this.size,
      renderArr: new Array(this.length).fill(0),
      sizeX: d3.scaleLinear()
        .range([0.5, 1])
        .domain([this.$store.state.peopleNumber / 2, (this.$store.state.peopleNumber * 2) / 3]),
      sizeAns: 0,
      noQuestionCol: d3.interpolate(d3.rgb(240, 240, 240), d3.rgb(200, 200, 200)),
      QuestionCol: d3.interpolate('rgb(204,220,255)', '#00A5FF'),
      // QuestionCol: d3.interpolate(d3.rgb('#77AAAA'), d3.rgb('#99CCCC')),
    };
  },
  watch: {
    edgeList(val) {
      this.groupid = this.$store.state.selectedGroup;
      this.renderArr = new Array(this.length);
      const { CHIGroup } = this.$store.state;
      for (let i = 0; i < this.renderArr.length; i += 1) {
        const id = CHIGroup[this.groupid][i][0];
        this.renderArr[i] = this.noQuestionCol(util.solveAvgQuestionCHIbyId(id, this.edgeList));
      }
      val.forEach((indexEdgeId) => {
        // console.log('hyperedge',)
        // console.log('modmodmod', ((indexEdgeId * 9301 + 49297) % 233280) / 233280);
        Vue.set(this.renderArr, indexEdgeId,
          this.QuestionCol(Math.random()));
      });
    },
  },
  mounted() {
    // console.log('renderArr', this.edgeList);
    this.sizeAns = this.sizeX(this.edgeNum);
    this.renderArr = new Array(this.length);
    const { CHIGroup } = this.$store.state;
    for (let i = 0; i < this.renderArr.length; i += 1) {
      const id = CHIGroup[this.groupid][i][0];
      this.renderArr[i] = this.noQuestionCol(util.solveAvgQuestionCHIbyId(id, this.edgeList));
    }
    this.edgeList.forEach((indexEdgeId) => {
      Vue.set(this.renderArr, indexEdgeId,
        this.QuestionCol(Math.random()));// '#50A5FF');
    });
  },
  methods: {
    selectHyperEdge() {
      console.log('edgeOption', this.edgeOption, this.edgeOptionNum);
      this.$store.commit('selectHyperEdge', [this.edgeQuestionId.map((x) => x), this.edgeOption, this.edgeOptionNum]);
    },
  },
};
</script>

<style scoped>
.yesQuestion {
    fill: #99ccff;
    stroke-width: 0.5;
    stroke: #555;
}
.yesQuestion:hover {
    fill: rgba(173, 224, 255);
}
.noQuestion {
    fill: #fff;
    stroke-width: 0.5;
    stroke: #555;
}
.noQuestion:hover {
    fill: rgba(200, 200, 200, 0.5);
}
</style>
