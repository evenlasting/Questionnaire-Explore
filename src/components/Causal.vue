/* eslint-disable no-self-assign */
<template>
<div style="height:100%">
    <!-- <CardTitle name='Causal'>
        <CausalConsstraints/>
    </CardTitle> -->
    <svg id='causalSvg' @contextmenu.prevent="openMenu($event)" @mousemove="movemousesss">
        <line :x1="begin[0]" :y1="begin[1]-20" :x2="end[0]" :y2="end[1]-20" stroke="black" stroke-width="2"
        marker-end="url(#arrow)"
        v-if="showline"
        >

        </line>
        <g id='causalGroup'/>
    </svg>
</div>
</template>

<script>
/* eslint-disable no-debugger */
import * as d3 from 'd3';
import axios from 'axios';
import * as d3color from 'd3-color';
import CardTitle from './utilComponents/CardTitle.vue';
import * as util from '../util/util';
import judgeLinesCross from '../util/graphic'
import {
  bfsForAllItem, findH,
} from '../data/Survey';
import CausalConsstraints from './CausalComponent/CausalConstraints.vue';

export default {
  name: 'causal',
  components: { CardTitle, CausalConsstraints },
  data() {
    return {
      selectSource: '',
      selectTarget: '',
      selectSourceBool: true,
      col: this.$store.state.problemColArr,
      questionTypeList: this.$store.state.questionTypeList,
      constraint: [],
      DATAB: this.$store.state.causalDATA,
      DATAB_BACK: this.$store.state.causalDATA,
      transform: {},
      centerPosList: [],
      linkList: [],
      questionList: [],
      showline:false,
      begin:[0,0],
      end:[0,0]
    };
  },
  mounted() {
    this.DATAB = this.$store.state.causalDATA;
    this.DATAB_BACK = this.$store.state.causalDATA;
    const graph = d3.select('#causalGroup');

    const svg = d3.select('#causalSvg');
    const that = this;
    this.marker = svg.append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')// 设置为strokeWidth箭头会随着线的粗细发生变化
      .attr('viewBox', '0 0 12 12')// 坐标系的区域
      .attr('refX', 6)// 箭头坐标
      .attr('refY', 6)
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', 'auto')// 绘制方向，可设定为：auto（自动确认方向）和 角度值
      .append('path')
      .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')// 箭头的路径
      .attr('fill', '#000');// 箭头颜色
    function zoomed({ transform }) {
      that.transform = {x: transform.x, y: transform.y, k: transform.k};
      graph.attr('transform', `translate(${transform.x},${transform.y})scale(${transform.k})`);
    }
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', zoomed);
    svg.call(this.zoom);
  },
  computed: {
    hyperEdge() {
      
      console.log("update sH");
      return Array.from(new Set([...this.$store.state.selectedHyperEdge,
        ...this.$store.state.causalAddNode]));
    },
    bfsAns() { //bfs input actually
      console.log('bfsAns change');
      console.log("update bfsAns");
      //   console.log(bfs(hyperEdge[0], hyperEdge[1]));
      //   return bfs(hyperEdge[0], hyperEdge[1]);
      console.log(this.hyperEdge, 'hyperEdgeNodes');
      return bfsForAllItem(this.hyperEdge,
        this.$store.state.causalDATA, [])//this.causalConstraints.requiredirect || []);
    },
    causeUrl() {
      return this.$store.state.causeUrl;
    },
    causalConstraints() {
      return this.$store.state.causalConstraints;
    },
    causalAddNode() {
      return this.$store.state.causalAddNode;
    },
  },
  watch: {
    hyperEdge() {
      this.DATAB_BACK = this.DATAB;// DATA;
      this.hyperEdge_BACK = this.hyperEdge;
    },
    bfsAns(val) {
      // this.DATAB = DATA;
      this.asyncBfsAns(val);
    },
    causalConstraints(val) {
      d3.select('#causalGroup').selectAll('*').remove();
      this.$store.dispatch('causalDATARequest', val);
    },
  },
  methods: {
    openMenu(e){
      if (this.showline) {
        this.showline = false;
        const end = [e.offsetX, e.offsetY];
        const beginPos = this.getTransformedPos(this.begin);
        const endPos = this.getTransformedPos(end);
        const beginCircle = this.getCircleByPoint(beginPos);
        const endCircle = this.getCircleByPoint(endPos);
        if (beginCircle >= 0 && endCircle >= 0 && beginCircle !== endCircle) {
          // add require direct
          this.addConstraints(0, beginCircle, endCircle);
        } else {
          const crossLink = this.getCrossLink(beginPos, endPos);
          if (crossLink) {
            // add forbidden direct
            this.addConstraints(1, crossLink.source, crossLink.target);
          }
        }
      }
      else {
        this.showline = true;
        this.begin = [e.offsetX, e.offsetY];
      }
    },
    movemousesss(e){
      this.end=[e.offsetX,e.offsetY]
    },
    getTransformedPos(pos) {
      return [
        pos[0] / this.transform.k - this.transform.x,
        pos[1] / this.transform.k - this.transform.y
      ];
      },
    getCircleByPoint(point) {
      const [pointx, pointy] = point;
      let res = -1;
      this.centerPosList.forEach((center, index) => {
        if (res >= 0) return;
        const distanceSq = (pointx - center.x)*(pointx - center.x) + (pointy - center.y)*(pointy - center.y)
        if (distanceSq < 3000) {
          res = index;
        }
      })
      return res >= 0 ? this.questionList[res] : -1;
    },
    getCrossLink(begin, end) {
      const [beginx, beginy] = begin;
      const [endx, endy] = end;
      let res = null;
      this.linkList.forEach(link => {
        if (res) return;
        const {source, target} = link;
        const {x: sourcex, y: sourcey} = this.centerPosList[source];
        const {x: targetx, y: targety} = this.centerPosList[target];
        const judgeRes = judgeLinesCross(beginx, beginy, endx, endy, sourcex, sourcey, targetx, targety)
        if (judgeRes) {
          res = {source: this.questionList[source], target: this.questionList[target]};
        }
      })
      return res;
    },
    addConstraints(type, source, target) {
      const parseConstrains = { requiredirect: [], forbiddendirect: [], target: [], source: [] };
      if (type === 0) {
        parseConstrains.requiredirect.push([util.name2Id(`Q${source}`), util.name2Id(`Q${target}`)]);
      } else {
        parseConstrains.forbiddendirect.push([util.name2Id(`Q${source}`), util.name2Id(`Q${target}`)]);
      }
      this.$store.commit('updateCausalConstraints', parseConstrains);
    },
    bfsForAllItemThis(hyperEdge) {
      return bfsForAllItem(hyperEdge, this.DATAB);
    },
    clickCircle(NodeId) {
      console.log('click');
      if (this.selectSourceBool) {
        this.selectSource = NodeId; this.selectSourceBool = false;
        console.log('select', NodeId);
      } else {
        this.selectTarget = NodeId;
        this.constraint.push([`${this.selectSource}`, `${this.selectTarget}`]);
        console.log('bfsans', this.bfsAns);
        // this.bfsAns.way.push({ target: this.selectTarget, source: this.selectSource });
        // eslint-disable-next-line no-self-assign
        // this.bfsAns = this.bfsAns;
        axios.post(`${this.causeUrl}/cause`, { r: this.constraint, node: this.bfsAns.nodes.map((x) => x.name) })
          .then((response) => {
            const { data } = response;
            this.DATAB_BACK = data;
            this.hyperEdge_BACK = this.bfsAns.nodes.map((x) => x.name);
            this.DATAB = data;
            // this.asyncBfsAns(data);
            axios.post(`${this.causeUrl}/restart`);
          });

        this.selectSourceBool = true;
      }
    },

    asyncBfsAnsToBottom(vv){

    },
    async asyncBfsAns(vv) {
      // if (this.$store.state.updatingCausality===true) return;
      let val = 1;
      val = vv;
      // val = {
      //   nodes: [{ name: 25 }, { name: 15 }],
      //   way: [{ source: 25, target: 15 }],
      // };
      // val.way = [{ target: 60, source: 25 }, { target: 60, source: 5 }];
      const { hAns, hMap } = findH(val);// Ans有几层，每层有什么,Map，谁在第几层
      // console.log('hhh', hAns, hMap, val);
      
      const hSum = [];
      this.$store.commit('hyperEdgeBack', hSum);
      hAns.forEach((hlist) => hlist.forEach((h) => hSum.push(h)));
      let hPos = [];
      const xLongestArr = new Array(100).fill(0);

      hSum.forEach((x) => { xLongestArr[hMap[x]] += 1; });
      // const xLongest = Math.max(...xLongestArr);
      // console.log('xlongest', xLongest);
      // const midPos = (xLongest * 200) / 2;
      const midPos = 100;

      hPos = hSum.map((id) => {
        const dis2midPos = (hAns[hMap[id]].indexOf(id) - (xLongestArr[hMap[id]] - 1) / 2) * 200;
        // console.log(dis2midPos);
        return {
          x: midPos + dis2midPos,
          y: hMap[id] * 150,
        };
      });
      this.centerPosList = JSON.parse(JSON.stringify(hPos));

      const hChildren = {};
      hSum.forEach((x) => { hChildren[x] = []; });
      val.way.forEach((link) => {
        const { target, source } = link;
        console.log(target,source)
        hChildren[target].push(source);
      });
      this.questionList = hSum;
      this.linkList = [];

      //   console.log('RAND2', RAndCoeffientMapforNode);
      d3.select('#causalGroup').selectAll('*').remove();
      const vis = d3.select('#causalGroup');// .attr('transform', 'translate(100, 100)');
      this.zoom.translateTo(d3.select('#causalSvg'), 100, 100);
      this.zoom.scaleTo(d3.select('#causalSvg'), 1.5);
      val.way.forEach((link) => {
        let { target, source } = link;
        target = hSum.indexOf(target);
        source = hSum.indexOf(source);
        this.linkList.push({source, target});
        // console.log(target, RAndCoeffientMapforNode, 'need');
        // const childId = RAndCoeffientMapforNode[target].children.indexOf(source);
        // const coefficient = RAndCoeffientMapforNode[target].coefficient[childId];
        // vis.append('text')
        //   .text(coefficient)
        //   .attr('x', (hPos[source].x + hPos[target].x) / 2)
        //   .attr('y', (hPos[source].y + hPos[target].y) / 2);
        const path = d3.path();
        path.moveTo(hPos[source].x, hPos[source].y - 30);
        const dy = (hPos[source].y + hPos[target].y) / 2;
        path.bezierCurveTo(hPos[source].x, dy, hPos[target].x,
          dy, hPos[target].x, hPos[target].y + 30);

        vis.append('path')
          .attr('d', path.toString())
          .attr('stroke', 'black')
          .style('fill', 'none')
          .style('stroke-width', `${3 * link.score}px`)
          // .style('stroke-dasharray', '5 5')
          .attr('id', `L${source}V${target}`)
          .attr('marker-end', 'url(#arrow)');
      });

      hPos.forEach((x, index) => {
        const that = this;
        // vis.append('circle')
        //   .attr('r', 10)
        //   .attr('cx', x.x)
        //   .attr('cy', x.y)
        // //   .attr('fill', (this.hyperEdge.includes(hSum[index])) ? '#50A5FF' : '#aaa')
        //   .attr('fill', this.col[this.questionTypeList[hSum[index]]])
        //   // .on('mouseover',()=>{console.log('over');})
        //   .on('click', () => { that.clickCircle(hSum[index]); });
        // console.log('hPos', hSum, index, hPos);
        const text = util.id2NameandQuestion(hSum[index]);// (`${DATA.nodes[hSum[index]]}:
        // ${DATA.question[`${DATA.nodes[hSum[index]]}`]}`);
        const color = d3color.color(this.col[this.questionTypeList[hSum[index]]]);
        color.opacity = 0.5;
        // const textStr = text.str;
        // vis.append('foreignObject')
        //   .attr('id', `Q${hSum[index]}`)
        //   .attr('x', x.x - 75)
        //   .attr('y', x.y - 25)
        //   .attr('width', 150)
        //   .attr('height', 150)
        //   .append('xhtml:div')
        //   .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        //   .text(`${text}`)
        //   .attr('class', 'longtext')
        //   .attr('style', `background-color:${`${color}`}`)
        //   .on('click', () => { that.clickCircle(hSum[index]); });
        console.log(that, text);
        const data = JSON.parse(JSON.stringify(
          this.$store.state.questionOptionNumArr[hSum[index]],
        ));
        const arcs = d3.pie()(data);
        console.log(arcs);
        const Arccolor = ['#FFF','#FFF','#FFF','#FFF','#FFF','#FFF','#FFF','#FFF','#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];
        const arcGenerators = d3.arc().innerRadius(0).outerRadius(20);
        arcs.forEach((arcPath, arcIndex) => {
          vis.append('path')
            .attr('d', arcGenerators(arcPath))
            .style('fill', Arccolor[16 - arcIndex])
            .attr('transform', `translate(${x.x}, ${x.y})`)
            .on('mousemove', (d) => {
              d3.select('#tooltip')
                .style('left', `${d.clientX + 10}px`)
                .style('top', `${d.clientY + 10}px`)
                .style('z-index', 20)
                .style('display', 'inline')
                .text(text);
            })
            .on('mouseleave', () => {
              d3.select('#tooltip')
                .style('display', 'none');
            })
            .on('click', () => {
              this.$store.dispatch('selectNodeinGraph', hSum[index]);
            });
        });
        // vis.append('path')
        //   .attr('d', d3.arc()({
        //     innerRadius: 0,
        //     outerRadius: 20,
        //     startAngle: 0,
        //     endAngle: Math.PI * 2,
        //   }))
        //   .style('fill', 'green')
        //   .attr('transform', `translate(${x.x}, ${x.y})`)
        //   .on('mousemove', (d) => {
        //     console.log(111111);
        //     d3.select('#tooltip')
        //       .style('left', `${d.clientX + 10}px`)
        //       .style('top', `${d.clientY + 10}px`)
        //       .style('z-index', 20)
        //       .style('display', 'inline')
        //       .text(text);
        //   })
        //   .on('mouseleave', () => {
        //     d3.select('#tooltip')
        //       .style('display', 'none');
        //   });
        vis.append('text')
          .attr('transform', `translate(${x.x - 50}, ${x.y + 5})`)
          .text(`Q${hSum[index]}`);

        // .attr('class', 'longtext');
        // . attr('style', 'writing-mode: tb;');
      });
      const RAndCoeffientMapforNode = {};
      await Object.keys(hChildren).forEach(async (node) => {
        const children = hChildren[node];
        if (children.length !== 0) {
          const ans = await axios
            .post(`${this.$store.state.url}/linear`, {
              // t: util.id2Name(node),
              // s: children.map((x) => util.id2Name(x)),
              t: Number(node),
              s: children,
            });
          // console.log(ans);
          if (!ans.data.success) return;
          RAndCoeffientMapforNode[node] = {
            R: ans.data.R,
            coefficient: ans.data.coefficient,
            children,
          };
        }
        let RBack = -1;
        // let xBack = 0;
        // let yBack = 0;
        let indexBack = 0;
        children.forEach((childrenId, index) => {
          const idinHPosCHild = hSum.indexOf(childrenId);
          const idinHPosNode = hSum.indexOf(Number.parseInt(node, 10));
          // console.log('children', hPos, hChildren, idinHPosCHild, idinHPosNode, hSum);
          vis.insert('text', 'foreignObject')
            .text(RAndCoeffientMapforNode[node].coefficient[index].toFixed(3))
            .attr('x', (hPos[idinHPosCHild].x + hPos[idinHPosNode].x) / 2 + 10)
            .attr('y', (hPos[idinHPosCHild].y + hPos[idinHPosNode].y) / 2);
          // console.log('ineedthis!!!!', `#L${idinHPosNode}V${idinHPosCHild}`);
          // d3.select(`#L${idinHPosCHild}V${idinHPosNode}`)

          // .style('stroke-width',
          // `${1 + 5 * Math.abs(RAndCoeffientMapforNode[node].coefficient[index])}px`);

          RBack = RAndCoeffientMapforNode[node].R;
          // xBack = hPos[idinHPosNode].x;
          // yBack = hPos[idinHPosNode].y;
          indexBack = idinHPosNode;
        });
        if (RBack !== -1) {
          // vis.append('text', 'foreignObject')
          //   .text(RBack.toFixed(3))
          //   .attr('x', xBack + 70)
          //   .attr('y', yBack);
          const text = util.id2NameandQuestion(hSum[indexBack]);
          // (`${DATA.nodes[hSum[indexBack]]}:${DATA.question[`${DATA.nodes[hSum[indexBack]]}`]}`);
          // const textStr = text.str;
          const x = hPos[indexBack];
          d3.select(`#Q${hSum[indexBack]}`).remove();
          const color = d3color.color(this.col[this.questionTypeList[hSum[indexBack]]]);
          color.opacity = (Math.abs(RBack)) * 20 + 0.4;
          // vis.append('foreignObject')
          //   .attr('x', x.x - 75)
          //   .attr('y', x.y - 25)
          //   .attr('width', 150)
          //   .attr('height', 150)
          //   .append('xhtml:div')
          //   .attr('xmlns', 'http://www.w3.org/1999/xhtml')
          //   .text(`${text}`)
          //   .attr('class', 'longtext')
          //   .attr('style', `background-color:${`${color}`}`)
          //   .on('click', () => { this.clickCircle(hSum[indexBack]); });
          console.log(text);
          console.log('Rback', RBack);
           RBack = 0.57;
          vis.append('path')
            .attr('d', d3.arc()({
              innerRadius: 25,
              outerRadius: 30,
              startAngle: 0,
              endAngle: Math.PI * 2 * RBack,
            }))
            .style('fill', '#DBAAAD')
            .attr('transform', `translate(${x.x}, ${x.y})`)
            .on('mousemove', (d) => {
              d3.select('#tooltip')
                .style('left', `${d.clientX + 10}px`)
                .style('top', `${d.clientY + 10}px`)
                .style('z-index', 20)
                .style('display', 'inline')
                .text('the fit score: '+RBack.toFixed(2));
            })
            .on('mouseleave', () => {
              d3.select('#tooltip')
                .style('display', 'none');
            })
        }

        // console.log('RAND1', d3.arc()({
        //   innerRadius: 80,
        //   outerRadius: 100,
        //   startAngle: 0,
        //   endAngle: Math.PI / 2,
        // }));
      });
    },
  },
};
</script>

<style>
#causalSvg{
  padding-top: 3em;
    height: 90%;
    width: 100%;
}

.longtext{
/* text-overflow:ellipsis; */
overflow: hidden;
border-radius:10px;
padding-left: 10px;
padding-right: 10px;
background-color: aqua;
color: black;
        text-align: center;
/* white-space: nowrap; */
height: 38px;
}

.longtext:hover{
  min-height: 39px;
height:auto;
border-radius:10px;
padding-left: 10px;
padding-right: 10px;
background-color: aqua;
color: black;
        text-align: center;
}
</style>
