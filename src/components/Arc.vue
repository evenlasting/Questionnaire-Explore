/* eslint-disable no-unused-vars */
<template>
<div style="height:100%">
  <!-- <CardTitile name='Respondent'>
    {{`${peopleIndexConstraints}`}}
  </CardTitile> -->
    <div id="arcDiagram">
        <svg id='arcSvg'>
        </svg>
    </div>
</div>
</template>

<script>
import * as d3 from 'd3';
import * as util from '../util/util';
import CardTitile from './utilComponents/CardTitle.vue';

export default {
  name: 'arc',
  components: {
    CardTitile,
  },
  data() {
    return {
      littleR: 100,
      bigR: 150,
      center: { x: 200, y: 200 },
      littlePadding: 0.03,
      bigPadding: 0.3,
      CurvePerPeople: 0,
      radiusPerPeople: 0.15,
      peopleOptionList: [[200, [1, 1]], [100, [1, 1]]],
      showNameThreshold: 0.5,

    };
  },
  computed: {
    peopleIndexConstraints() {
      const con = this.$store.state.peopleIndexConstraints;
      return (typeof (con[1]) === 'undefined') ? 'ALL' : `who answered '${con[1]}' in Q${con[0]}`;
    },
    selectedHyperEdge() {
      return this.$store.state.selectedHyperEdge;
    },
    questionOption() {
      return this.$store.state.questionOption;
    },
    selectedNode() {
      return this.$store.state.selectedNode;
    },
  },
  watch: {
    selectedNode(val) {
      const selectedHyperEdge = [val];
      this.hyperEdgeOption = [util.findQuestionOptionsbyId(val).slice(0, 4)];
      this.hyperEdgeOptionNum = [util.findQuestionOptionsNumbyId(val).slice(0, 4)];
      d3.select('#arcCurve')
        .selectAll('*')
        .remove();
      d3.select('#circleSvg')
        .selectAll('*')
        .remove();
      d3.select('#nameLayer')
        .selectAll('*')
        .remove();
      this.curveList = this.solveCurve(selectedHyperEdge.map(
        (x) => util.findQuestionOptionsNumbyId(x),
      ));
      this.curveNameList = selectedHyperEdge.map(
        (x) => util.findQuestionOptionsbyId(x),
      );
      // console.log('I need this', this.curveList);
      this.curveList.forEach((list, index) => {
        // eslint-disable-next-line no-unused-vars
        this.nameLayer
          .append('text')
          .text(util.id2Question(selectedHyperEdge[index]))
          .attr('x',
            ((this.bigR + this.littleR))
        * (Math.sin((list[0][0] + list[list.length - 1][1]) / 2)))
          .attr('y',
            ((this.bigR + this.littleR / 3))
        * (Math.cos((list[0][0] + list[list.length - 1][1]) / 2)));

        list.forEach((curvePair, pairIndex) => {
          // let name = '';
          // if (curvePair[1] - curvePair[0] > this.showNameThreshold) {
          const name = this.curveNameList[index][pairIndex];
          // }
          d3.select('#arcCurve')
            .append('path')
            .on('mousemove', (d) => {
              d3.select('#tooltip')
                .style('left', `${d.clientX + 10}px`)
                .style('top', `${d.clientY + 10}px`)
                .style('z-index', 20)
                .style('display', 'inline')
                .text(name);
            })
            .on('mouseleave', () => {
              d3.select('#tooltip')
                .style('display', 'none');
            })
            .attr('d', this.solvePath(curvePair[0], curvePair[1], name))
            .attr('fill', this.$store.state.problemColArr[
              this.$store.state.questionTypeList[selectedHyperEdge[index]]
            ])
            .on('click', () => {
              console.log('clickselectNode', selectedHyperEdge[index]);
              this.dataRequestContraints = [selectedHyperEdge[index], name];
              this.$store.dispatch('dataRequestContraints', this.dataRequestContraints);
            });
        });
      });
    },
    questionOption() {
      this.hyperEdgeOption = this.$store.state.questionOption;
      this.hyperEdgeOptionNum = this.$store.state.questionOptionNum;
      d3.select('#arcCurve')
        .selectAll('*')
        .remove();
      d3.select('#circleSvg')
        .selectAll('*')
        .remove();
      d3.select('#nameLayer')
        .selectAll('*')
        .remove();
      this.curveList = this.solveCurve(this.selectedHyperEdge.map(
        (x) => util.findQuestionOptionsNumbyId(x),
      ));
      this.curveNameList = this.selectedHyperEdge.map(
        (x) => util.findQuestionOptionsbyId(x),
      );
      // console.log('I need this', this.curveList);
      this.curveList.forEach((list, index) => {
        // eslint-disable-next-line no-unused-vars
        this.nameLayer
          .append('foreignObject')
          .attr('x',
            ((this.bigR + this.littleR) + 10)
        * (Math.sin((list[0][0] + list[list.length - 1][1]) / 2)) - 70)
          .attr('y',
            ((this.bigR + this.littleR / 3))
        * (Math.cos((list[0][0] + list[list.length - 1][1]) / 2)) - 40)
          .attr('width', '150')
          .attr('height', '100')
          .append('xhtml:div')
          .attr('xmlns', 'http://www.w3.org/1999/xhtml')
          .attr('class', 'longtextArc')
          .text(`${util.id2Name(this.selectedHyperEdge[index])
          }:${util.id2Question(this.selectedHyperEdge[index])}`);

        list.forEach((curvePair, pairIndex) => {
          let name = '';
          // if (curvePair[1] - curvePair[0] > this.showNameThreshold) {
          name = this.curveNameList[index][pairIndex];
          // }
          d3.select('#arcCurve')
            .append('path')
            .attr('d', this.solvePath(curvePair[0], curvePair[1], name))
            .attr('fill', this.$store.state.problemColArr[
              this.$store.state.questionTypeList[this.selectedHyperEdge[index]]
            ])
            .on('mousemove', (d) => {
              d3.select('#tooltip')
                .style('left', `${d.clientX + 10}px`)
                .style('top', `${d.clientY + 10}px`)
                .style('z-index', 20)
                .style('display', 'inline')
                .text(name);
            })
            .on('mouseleave', () => {
              d3.select('#tooltip')
                .style('display', 'none');
            })
            .on('click', () => {
              // console.log('click', this.selectedHyperEdge[index]);
              this.dataRequestContraints = [this.selectedHyperEdge[index], name];
              this.$store.dispatch('dataRequestContraints', this.dataRequestContraints);
            });
        });
      });
      // console.log(this.hyperEdgeOption, this.hyperEdgeOptionNum, 'this.hyper');
      this.hyperEdgeOption.forEach((optionArr, optionArrIndex) => {
        /* eslint-disable max-len */
        // console.log('optionArr', optionArr, this.selectedHyperEdge);
        const optionIdArr = optionArr.map((option, index) => util.findQuestionOptionIdbyContext(option, this.selectedHyperEdge[index]));
        // console.log('!~~~~', this.hyperEdgeOptionNum[optionArrIndex], optionIdArr, this.colorArr[optionArrIndex]);
        this.addPeople(this.hyperEdgeOptionNum[optionArrIndex], optionIdArr, this.colorArr[optionArrIndex]);
      });
    },
  },
  mounted() {
    this.colorArr = this.$store.state.colorArr;
    const svg = d3.select('#arcSvg')
      .append('g')
      .attr('transform', 'scale(0.8)translate(50,+20)')
      .append('g')
      .attr('id', 'arcGraph')
      .attr('transform', 'translate(300,200)')
      .append('g')
      .attr('id', 'arcCurve');
    this.nameLayer = d3.select('#arcGraph')
      .append('g')
      .attr('id', 'nameLayer');
    d3.select('#arcGraph')
      .insert('g', '#arcCurve') //   在arcCurve后面加一个g
      .attr('id', 'circleSvg');
    this.peopleList = [[100, 300, 100], [100, 300, 100]];
    this.curveList = this.solveCurve(this.peopleList);
    // svg.append('path')
    //   .attr('d', this.solvePath(curveList[0][0][0], curveList[0][0][1]));
    this.curveList.forEach((list) => {
      list.forEach((curvePair) => {
        svg.append('path')
          .attr('d', this.solvePath(curvePair[0], curvePair[1], ''))
          .attr('fill', this.$store.state.normalProblemCol)
          .on('mousemove', (d) => {
            d3.select('#tooltip')
              .style('left', `${d.clientX + 10}px`)
              .style('top', `${d.clientY + 10}px`)
              .style('z-index', 20)
              .style('display', 'inline')
              .text('name');
          })
          .on('mouseleave', () => {
            d3.select('#tooltip')
              .style('display', 'none');
          });
      });
    });
    this.peopleOptionList.forEach((optionList, index) => {
      this.addPeople(optionList[0], optionList[1], this.colorArr[index]);
    });
  },
  methods: {
    addPeople(number, optionList, col) {
      // console.log(number, optionList, col, 'people');
      const circleSvg = d3.select('#circleSvg');
      const radius = number * this.radiusPerPeople;
      optionList.forEach((option, questionIndex) => {
        // console.log('curveList', this.curveList, this.curveList[questionIndex], option);
        const beginCurve = this.curveList[questionIndex][option][0];
        const endCurve = beginCurve + number * this.CurvePerPeople;
        // console.log('endCurve', beginCurve, endCurve);
        // circleSvg.append('polygon')
        //   .attr('points', `0,0
        //     ${Math.sin(beginCurve) * this.bigR},${Math.cos(beginCurve) * this.bigR}
        //     ${Math.sin(endCurve) * this.bigR},${Math.cos(endCurve) * this.bigR}`)
        //   .attr('style', `fill:rgba(${col},1)`);
        circleSvg.append('path')
          .attr('d', d3.arc()({
            outerRadius: this.bigR,
            startAngle: Math.PI - endCurve,
            endAngle: Math.PI - beginCurve,
            innerRadius: 0,
          }))
          .attr('style', `fill:rgba(${col},1)`);
        this.curveList[questionIndex][option][0] += number * this.CurvePerPeople;
      });
      circleSvg.append('circle')
        .attr('r', radius)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', `rgba(${col},1)`);
    },
    solveCurve(dataList) {
    //   console.log('~~~~~~~~~~~', dataList);
      let sumPadding = dataList.length * this.bigPadding;// 圆，不用减一
      // eslint-disable-next-line max-len
      if (dataList.length === 1) sumPadding = this.littlePadding;// 只有一个问题就没有大padding,但是多一个小padding
      let sumPeople = 0;
      dataList.forEach((list) => {
        sumPadding += (list.length - 1) * this.littlePadding;
        list.forEach((number) => { sumPeople += number; });
      });
      // console.log('sumpeople', sumPeople, dataList);
      const leftCurve = Math.PI * 2 - sumPadding;
      this.CurvePerPeople = leftCurve / sumPeople;
      let arcList = [];
      arcList = dataList.map((list) => list.map((number) => (number * leftCurve) / sumPeople));
      const beginEndArcList = [];
      let temp = 0;
      for (let i = 0; i < arcList.length; i += 1) {
        const tempList = [];
        for (let j = 0; j < arcList[i].length; j += 1) {
          tempList.push([temp, temp + arcList[i][j]]);
          temp += this.littlePadding + arcList[i][j];
        }
        beginEndArcList.push(tempList);
        temp += this.bigPadding - this.littlePadding;
      }
      return beginEndArcList;
    },
    solvePath(beginCurve, endCurve, name) {
      // this.nameLayer
      // .append('text')
      // .text()
    //   console.log('beginCurve', beginCurve, endCurve);
      const { littleR, bigR } = this;
      // console.log(name);
      // const nameP = [1.5 * bigR * Math.sin((beginCurve + endCurve) / 2), 1.5 * bigR * Math.cos((beginCurve + endCurve) / 2)];
      // d3.select('#nameLayer')
      //   .append('foreignObject')
      //   .attr('x', nameP[0] - 80)
      //   .attr('y', nameP[1])
      //   .attr('width', '150')
      //   .attr('height', '50')
      //   .append('xhtml:div')
      //   .attr('width', '150px')
      //   .attr('height', '50px')
      //   .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      //   .attr('class', 'longtextArc')
      //   .text(name);
      const fP = [littleR * Math.sin(beginCurve), littleR * Math.cos(beginCurve)];
      const sP = [bigR * Math.sin(beginCurve), bigR * Math.cos(beginCurve)];
      const tP = [littleR * Math.sin(endCurve), littleR * Math.cos(endCurve)];
      const foP = [bigR * Math.sin(endCurve), bigR * Math.cos(endCurve)];
      const bigCurOrsmallCur = (endCurve - beginCurve > Math.PI) ? 1 : 0;
      let d = `M ${fP[0]} ${fP[1]} A ${this.littleR} ${this.littleR} 0 ${bigCurOrsmallCur} 0 ${tP[0]} ${tP[1]}`;
      d += ` L ${foP[0]} ${foP[1]} A ${this.bigR} ${this.bigR} 0 ${bigCurOrsmallCur} 1 ${sP[0]} ${sP[1]} z`;
      return d;
    },
  },
};
</script>

<style scoped>

svg{
    width:100%;
    height: 100%;
}
div{
    width:100%;
    height: 100%;
}
</style>

<style>
.longtextArc{

/* text-overflow:ellipsis; */

/* overflow: hidden; */
border-radius:10px;
padding-left: 10px;
padding-right: 10px;
/* background-color: aqua; */
color: black;
text-align: center;
/* white-space: nowrap; */
height: auto;
}

.longtextArc:hover{

border-radius:10px;
padding-left: 10px;
padding-right: 10px;
/* background-color: aqua; */
color: black;
text-align: center;
/* white-space: nowrap; */
height: auto;
}
</style>
