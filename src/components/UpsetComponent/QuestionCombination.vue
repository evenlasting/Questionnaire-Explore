<template>
    <g id="hyper" :transform="'translate('+this.translateX+' 0)'">
        <circle
            v-for="(item,index) in renderArr"
            :key="'hype'+index+'/'+combinationIndex+'/'+item"
            :transform="'translate(0 ' + index*size+')'"
            :r="renderSizeArr[index]"
            :fill="item"
            @click="selectHyperEdge()"
        />
        <line
          :x0="0"
          :x1="0"
          :y1="lineBegin * size"
          :y2="lineEnd * size"
          :style="'stroke-width:' + strokeWidth + ';stroke: black;' + 'stroke-dasharray: ' + 1000 + ' , 5'"
          @click="selectHyperEdge()"
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
    // 'left',
    // 'top',
    // 'size',
    // 'edgeList',
    'combinationIndex',
    'questionArr',
    'hyperEdge',
    'groupid'
    // 'length',
    // 'edgeQuestionId',
    // 'edgeNum',
    // 'edgeOption',
    // 'edgeOptionNum',
  ],
  computed:{
    lineBegin(){
        let min=Number.MAX_SAFE_INTEGER;
        this.hyperEdge.question.forEach(q=>
            min=Math.min(min,this.questionArr.indexOf(q))
        )
        return min;
    },
    lineEnd(){
        let max=-1;
        this.hyperEdge.question.forEach(q=>
            max=Math.max(max,this.questionArr.indexOf(q))
        )
        return max;
    },
    size(){
      return this.$store.state.size;
    },
    translateX(){
        return  this.combinationIndex * this.size
    },
    strokeWidth(){
        return Math.pow(eval(this.hyperEdge.option_num.join("+"))/100,2)/3;
    },
    questionid() {
      return this.$store.state.selectedNode;
    },
  },
  data() {
    return {
      renderArr: new Array(this.questionArr.length).fill('#DDD'),
      renderSizeArr: new Array(this.questionArr.length).fill(this.$store.state.size/5),
      sizeX: d3.scaleLinear()
        .range([0.5, 1])
        .domain([this.$store.state.peopleNumber / 2, (this.$store.state.peopleNumber * 2) / 3]),
      sizeAns: 0,
      noQuestionCol: d3.interpolate(d3.rgb(150, 150, 150), d3.rgb(30, 30, 30)),
      QuestionCol: d3.interpolate('rgb(204,220,255)', '#00A5FF'),
      // QuestionCol: d3.interpolate(d3.rgb('#77AAAA'), d3.rgb('#99CCCC')),
    };
  },
  watch: {
    combinationIndex(){
        console.log('indexUpdate')
    },
    questionid(val) {
        console.log('forceupdate')
        this.$forceUpdate();
    },
  },
  mounted() {
    console.log('draw question combination');
    // console.log('renderArr', this.edgeList);
    // this.sizeAns = this.sizeX(this.edgeNum);
    const aaa=new Array(2000).fill(-2);
    const { CHIGroup } = this.$store.state;
    for (let i = 0; i < this.renderArr.length; i += 1) {
      const id = CHIGroup[this.groupid][i][0];
      aaa[i] = util.solveAvgQuestionCHIbyId(id, this.hyperEdge.question)
    }
    let max=-3;
    let maxI=-1;
    aaa.forEach((x,index)=>{
      if (x>max && (this.hyperEdge.question.indexOf(CHIGroup[this.groupid][index][0])===-1)){
        max=x;
        maxI=index
      }
    })
    this.renderArr[maxI] = this.noQuestionCol(max);
    this.hyperEdge.question.forEach(q=>
    {
      Vue.set(this.renderArr,this.questionArr.indexOf(q),'#000')
      Vue.set(this.renderSizeArr,this.questionArr.indexOf(q),this.size/4)
    }
    
    )
    // const { CHIGroup } = this.$store.state;
    // for (let i = 0; i < this.renderArr.length; i += 1) {
    //   const id = CHIGroup[this.groupid][i][0];
    //   this.renderArr[i] = this.noQuestionCol(util.solveAvgQuestionCHIbyId(id, this.edgeList));
    // }
    // this.edgeList.forEach((indexEdgeId) => {
    //   Vue.set(this.renderArr, indexEdgeId,
    //     this.QuestionCol(Math.random()));// '#50A5FF');
    // });
  },
  methods: {
    selectHyperEdge() {
      this.$store.commit('selectHyperEdge', [this.hyperEdge.question.map((x) => x), this.hyperEdge.option, this.hyperEdge.option_num]);
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
