<template>
  <div style="height:100%;">
    <CardTitle name='Hypergraph'>
        <div style="flex:auto">
          <input type="file" value="" id="file" @change="uploadData"/>
          <el-popover
          trigger="click"
          style="padding-left:0px">
          <el-input
            type="textarea"
            v-model="graphConstraints"
            :autosize="{ minRows: 5, maxRows: 10}"
            @blur="finishInput">
          </el-input>
          <button slot="reference" icon="el-icon-edit">Constraints</button>
    </el-popover>
        </div>
    </CardTitle>
    <div id="forceGraph"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import * as util from '../util/util';
import CardTitle from './utilComponents/CardTitle.vue';
// import solveForceMapCoordinate from '../util/forcegraph';

export default {
  name: 'graph',
  data() {
    return {
      links: [],
      nodes: [],
      littleRectLength: 25,
      drawGraph: null,
      matrixList: [],
      matrixTranslate: [[800, 500], [300, 200], [1100, -0],
        [1650, 150], [400, 700], [1500, 500]],
      matrixContent: [],
      graphConstraints: '',
      bicluster:[]
    };
  },
  components: {
    CardTitle,
  },
  computed: {
    biclusterInfo(){
      return this.$store.state.bicluster;
    },
    CHIBACK() {
      return this.$store.state.CHIBACK;
    },
    selectNodeId() {
      return this.$store.state.selectedNode;
    },
    screenCenterQuestionId() {
      return this.$store.state.screenCenterQuestionId;
    },
    CHIid2GroupMap() {
      const { groupArr } = this.$store.state;
      const ans = new Array(this.$store.state.CHI.length).fill(0);
      groupArr.forEach((group, index) => { group.forEach((id) => { ans[id] = index; }); });
      return ans;
    },
    CHIArr() {
      const ans = [];
      const { CHI } = this.$store.state;
      for (let i = 0; i < CHI.length; i += 2) {
        for (let j = i + 1; j < CHI.length; j += 4) {
          if (CHI[i][j] > 0.99999 && (this.CHIid2GroupMap[i] !== this.CHIid2GroupMap[j])) {
            const posListI = this.getQuestionPos(i);
            const posListJ = this.getQuestionPos(j);
            let ansI;
            let ansJ;
            let ansMax = 999999;
            posListI.forEach((posI, indexI) => {
              posListJ.forEach((posJ, indexJ) => {
                if (ansMax > (posI[0] - posJ[0]) ** 2 + (posI[1] - posJ[1]) ** 2) {
                  ansI = indexI;
                  ansJ = indexJ;
                  ansMax = (posI[0] - posJ[0]) ** 2 + (posI[1] - posJ[1]) ** 2;
                }
              });
            });
            // eslint-disable-next-line no-continue
            console.log('ansMax', ansMax);
            if (ansMax < 65000) { ans.push([posListI[ansI], posListJ[ansJ]]); }
          }
        }
      }
      return ans;
    },
  },
  // watch: {
  //   CHIBACK() {
  //     this.redraw();
  //   },
  //   screenCenterQuestionId(val) {
  //     const pos = this.getQuestionPos(val)[1];
  //     console.log('pos', pos);
  //     this.zoom
  //       .scaleTo(this.svg, 1);
  //     // this.graph.attr('transform', 'scale(1)');
  //     this.zoom
  //       .translateTo(this.svg, pos[0], pos[1] + 50);
  //     // .scaleTo(this.svg, 1);
  //   },
  //   selectNodeId(val) {
  //     const pos = this.getQuestionPos(val);
  //     const graph = d3.select('#GraphCircle');
  //     graph.selectAll('*').remove();
  //     graph.append('circle')
  //       .attr('cx', pos[1][0])
  //       .attr('cy', pos[1][1] + 10)
  //       .attr('fill', 'black')
  //       .attr('stroke', 'black')
  //       .attr('r', 2);
  //     // graph.append('circle')
  //     //   .attr('cx', pos[0][0] - 10)
  //     //   .attr('cy', pos[0][1])
  //     //   .attr('fill', 'black')
  //     //   .attr('stroke', 'black')
  //     //   .attr('r', 2);
  //   },
  // },
  // mounted() {
  //   // solveForceMapCoordinate();
  //   this.initSvg();
  //   this.dataProcessing();
  //   this.clusterProcessing();
  //   this.drawForceGraphd3();
  //   this.setMatrixPosition();
  //   this.drawGraph.append('g')
  //     .attr('id', 'lineGraph');
  //   // console.log(this.$store.state.CHIGroup);
  //   // this.$store.dispatch('selectNodeinGraph', 4);
  //   this.drawGraph.append('g').attr('id', 'GraphCircle');
  //   this.drawInitLine();
  // },
  methods: {
    finishInput() {
      const constrainArr = this.graphConstraints.split(/\r?\n/);
      const { groupArr } = this.$store.state;
      const { CHIGroup } = this.$store.state;
      constrainArr.forEach((constrain) => {
        const r = constrain.split('-->');
        const source = Number(r[0]);
        const target = Number(r[1]);
        let sourceGroupId;
        let targetGroupId;
        let itemId;
        groupArr.forEach((group, index) => {
          console.log('group', group, groupArr);
          if (group.indexOf(source) !== -1) {
            sourceGroupId = index;
            itemId = group.indexOf(source);
          }
          if (group.indexOf(target) !== -1) {
            targetGroupId = index;
          }
        });
        const [delItem] = CHIGroup[sourceGroupId].splice(itemId, 1);
        CHIGroup[targetGroupId].push(delItem);
        console.log(sourceGroupId, targetGroupId);
      });
      console.log(CHIGroup, 'CHIGroup', this.$store.state.CHIGroup);
      this.$store.commit('updataCHIGroup', CHIGroup);
      this.redraw();
    },
    redraw() {
      this.matrixList = [];
      this.matrixContent = [];
      this.initSvg();
      this.dataProcessing();
      this.clusterProcessing();
      this.drawForceGraphd3();
      this.setMatrixPosition();
      this.drawGraph.append('g')
        .attr('id', 'lineGraph');
      this.drawGraph.append('g').attr('id', 'GraphCircle');
      this.drawInitLine();
    },
    uploadData(event) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      const url = `${this.$store.state.url}/datainput`;
      console.log('input', url);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      // this.$store.commit('updateLoading', true);
      axios.post(url, formData, config).then((rep) => {
        // this.$store.commit('updateLoading', false);
        console.log(rep);
      });
      this.loading = true;
    },
    changeGroup(questionName, groupindex) {
      const questionId = util.name2Id(questionName);
      let { groupArr } = this.$store.state;
      const { CHIGroup } = this.$store.state;
      let groupdId; let itemId;
      groupArr.forEach((group, index) => {
        console.log('group', group, groupArr);
        if (group.indexOf(questionId) !== -1) {
          groupdId = index;
          itemId = group.indexOf(questionId);
        }
      });
      const delItem = CHIGroup[groupdId].splice(itemId, 1);
      CHIGroup[groupindex].push(delItem);
      groupArr = CHIGroup.map((arr) => arr.map((data) => data[0]));
      this.initSvg();
      // this.dataProcessing();
      // this.drawForceGraphd3();
      // this.setMatrixPosition();
      // this.drawGraph.append('g')
      //   .attr('id', 'lineGraph');
      // // console.log(this.$store.state.CHIGroup);
      // // this.$store.dispatch('selectNodeinGraph', 4);
      // this.drawGraph.append('g').attr('id', 'GraphCircle');
      // this.drawInitLine();
    },
    drawInitLine() {
      d3.select('#lineGraph')
        .selectAll('*')
        .remove();

      // let questionPos = ['Q4', 'Q40', 'Q41', 'Q69', 'Q70', 'Q67', 'Q6', 'Q38',
      //   'Q32', 'Q33', 'Q2', 'Q18', 'Q15'];
      // questionPos = questionPos.map((x) => this.getQuestionPos(util.name2Id(x)));
      // console.log(questionPos);
      const questionPair = [[[0, 1], [1, 3]]];// , [2, 2, 5, 0], [1, 2, 6, 0],
      // [6, 2, 4, 0], [5, 2, 9, 0], [8, 1, 7, 3], [11, 3, 12, 1]];
      // const questionPair = this.CHIArr;
      questionPair.forEach((x) => this.drawLine(x[0], x[1]));
    },
    getQuestionPos(questionId) {
      let matrixId = 0;
      let questionIdinMatrix = 0;
      for (let i = 0; i < this.matrixContent.length; i += 1) {
        for (let j = 0; j < this.matrixContent[i].length; j += 1) {
          if (this.matrixContent[i][j][0] === questionId) {
            matrixId = i;
            questionIdinMatrix = j;
          }
        }
      }
      const [posX, posY] = this.matrixTranslate[matrixId];
      const dd = this.littleRectLength / 2;
      // posY += this.littleRectLength / 2;
      //   posY += 0;
      const delta = questionIdinMatrix * this.littleRectLength;
      const all = this.matrixContent[matrixId].length * this.littleRectLength;
      const pos = [[posX - dd * 2, posY + all - delta - dd],
        [posX + delta + dd, posY + all + dd * 2],
        [posX + all + dd * 3, posY + delta + dd],
        [delta + posX + dd, posY - dd * 2]];
      return pos;
    },
    drawLine(pointList1, pointList2) {
      // const g = this.drawGraph.append('g')
      //   .attr('id', 'lineGraph');
      // eslint-disable-next-line no-debugger
      // debugger;
      const dx = (pointList1[0] + pointList2[0]) / 2;
      const g = d3.select('#lineGraph');
      const link = d3.path();
      link.moveTo(pointList1[0], pointList1[1]);
      link.bezierCurveTo(dx, pointList1[1], dx, pointList2[1], pointList2[0], pointList2[1]);
      g.append('path')
        .attr('d', link.toString())
        .attr('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', '1')
        .style('stroke-dasharray', '5 5');
      // .attr('x1', pointList1[0])
      // .attr('y1', pointList1[1])
      // .attr('x2', pointList2[0])
      // .attr('y2', pointList2[1])
      // .attr('stroke', 'red');
    },
    initSvg() {
      d3.select('#forceGraph').selectAll('*').remove();
      const svg = d3.select('#forceGraph')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');
        // .attr('transform', 'rotate(-45)');
      const graph = svg.append('g')
        .attr('transform', 'translate(50,0)');
      this.graph = graph;
      this.svg = svg;
      this.zoomed = function zoomed({ transform }) {
        graph.attr('transform', `translate(${transform.x},${transform.y})scale(${transform.k})`);
      };
      this.zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', this.zoomed);
      svg.call(this.zoom);
      this.drawGraph = graph;
      this.zoom
        .translateTo(this.svg, -1200, -1400);
      this.zoom.scaleTo(this.svg, 0.47);
    },
    drawForceGraphd3() {
      const { drawGraph } = this;
      const { demographicCol, coreProblemCol, questionTypeList } = this.$store.state;

      const rectLength = d3.scaleLinear().range([0, this.littleRectLength]).domain([0.05, 0]);
      const nColor = d3.scaleLinear()
        .range(['white', 'rgb(224,240,255)', '#00A5FF', '#0099FF']).domain([0, 0.5, 5, 6]);
      // const nColor = d3.scaleLinear().range(['rgb(255,255,255)', '#000']).domain([0, 3]);
      const demoColor = d3.scaleLinear().range(['white', demographicCol]).domain([this.$store.state.peopleNumber / 2, (this.$store.state.peopleNumber * 2) / 3]);
      const coreColor = d3.scaleLinear().range(['white', coreProblemCol]).domain([this.$store.state.peopleNumber / 2, (this.$store.state.peopleNumber * 2) / 3]);
      const colList = [demoColor, nColor, coreColor];
      const { CHIGroup } = this.$store.state;
      CHIGroup.forEach((group, index) => {
        if (group.length <= 1) return;
        this.matrixContent.push(group);
        // if (index === 4) return;
        let nameList = group.map((x) => this.NODE[x[0]]);
        // nameList = nameList.map((x) => ((x.length < 3) ? `${x}&nbsp&nbsp` : x));
        nameList=this.bicluster[index].questionOrder[index].reverse().map(x=>`Q${x}`);
        const axisX = d3.scaleBand()
        .range([0, 7 * this.littleRectLength])
          // .range([0, nameList.length * this.littleRectLength])
          // .domain(nameList);
        const axisY = d3.scaleBand()
          .range([nameList.length * this.littleRectLength, 0])
          .domain(nameList);
        const graph = drawGraph.append('g');
        graph.attr('id', `${index}graph`);
        this.matrixList.push({ index, graph });
        // console.log('I need', this.matrixList);
        graph.append('g')
          .classed('axisLeft', true)
          .call(d3.axisLeft(axisY));
        graph.append('g')
          .classed('axisBottom', true)
          .attr('transform', `translate(0,${nameList.length * this.littleRectLength})`)
          .call(d3.axisBottom(axisX));
        graph.append('g')
          .classed('axisTop', true)
          .call(d3.axisTop(axisX));
        graph.append('g')
          .classed('axisRight', true)
          .attr('transform', `translate(${7 * this.littleRectLength},0)`)
          .call(d3.axisRight(axisY));
        const rect = graph.append('g');

        console.log('before blue loop', group);
        if (index===0){
          const length=nameList.length * this.littleRectLength;
          this.bicluster[0].bicluster_shown_position.forEach(position=>{
            const {left,top,height,width}=position
            graph.append('rect')
              .attr('x',left*length)
              .attr('y',top*length)
              .attr('width',width*length)
              .attr('height',height*length)
              .attr('fill','#00A5FF')
          })
        }
        // for (let i = 0; i < group.length; i += 1) {
        //   for (let j = 0; j < group.length; j += 1) {
        //     const firstId = group[i][0];
        //     const secId = group[j][0];
        //     let size;
        //     let color;
        //     let num = 0;
        //     if (i < j || this.CHIBACK.length === 0) {
        //       num = this.$store.state.nodesConnections[Math.min(
        //         firstId, secId,
        //       )][Math.max(firstId, secId)];
        //       size = rectLength(this.$store.state.CHI[firstId][secId]);
        //     } else if (i > j) {
        //       num = this.$store.state.nodesConnectionsBACK[Math.min(
        //         firstId, secId,
        //       )][Math.max(firstId, secId)];
        //       size = Math.max(0, rectLength(this.$store.state.CHIBACK[firstId][secId]));
        //     }
        //     if (firstId === secId) size = 0;
        //     color = (colList[questionTypeList[firstId]])(num);
        //     color = colList[1](num);
        //     // rect.append('rect')
        //     //   .attr('x', axisX(this.NODE[firstId]) + 2)
        //     //   .attr('y', axisY(this.NODE[secId]))
        //     //   .attr('width', this.littleRectLength)
        //     //   .attr('height', this.littleRectLength)
        //     //   .style('fill', d3.rgb(230, 230, 220));
        //     rect.append('rect')
        //       .attr('x', axisX(this.NODE[firstId]) + (this.littleRectLength - size) / 2 + 2)
        //       .attr('y', axisY(this.NODE[secId]) + (this.littleRectLength - size) / 2)
        //       .attr('width', size)
        //       .attr('height', size)
        //       .style('fill', color)
        //       .on('click', () => {
        //         this.$store.dispatch('selectNodeinGraph', group[i][0]);
        //       });
        //   }
        // }
      });
      this.text = d3.selectAll('.tick>text');
      // eslint-disable-next-line func-names
      // const that = this;
      this.text
      // .on('mousedown', (d, i, g) => {
      //   that.selectedTick = this;
      //   // this.attr('color', 'red');
      //   that.svg.on('.zoom', null);
      //   // that.svg.call(that.zoomTick);
      //   console.log('tick11111', d, i, g, this);
      //   that.selectedQuestion = i;
      // })
        .on('mouseup', () => {
          this.svg.call(this.zoom);
        })
        .on('mousemove', (d, name) => {
          d3.select('#tooltip')
            .style('left', `${d.clientX + 10}px`)
            .style('top', `${d.clientY + 10}px`)
            .style('z-index', 20)
            .style('display', 'inline')
            .text(util.id2Question(util.name2Id(name)));
        })
        .on('mouseleave', () => {
          d3.select('#tooltip')
            .style('display', 'none');
        });
      console.log('tick!!!!!!!!!!!!!', this.text);
    },
    clusterProcessing(){
      const questionOrder=[]
      const respondentOrder=[]
      const bicluster=[]
      const peopleNumber=this.$store.state.peopleNumber
      this.biclusterInfo.forEach(cluster=>{
        const {axis_order,biclusters,bicluster_index_shown}=cluster
        const q_order=axis_order.q_order
        let q_order_all=[]
        q_order.locked.forEach(lockedPair=> lockedPair.forEach(x=>q_order_all=q_order_all.concat(x)))
        q_order_all=q_order_all.concat(q_order.unlocked)
        questionOrder.push(q_order_all)
        const r_order=axis_order.r_order
        let r_order_all=[]
        r_order.locked.forEach(lockedPair=> lockedPair.forEach(x=>r_order_all=r_order_all.concat(x)) )
        r_order_all=r_order_all.concat(r_order.unlocked)
        respondentOrder.push(r_order_all)

        const bicluster_shown=bicluster_index_shown.map(index=>biclusters[index])
        const bicluster_shown_position=bicluster_shown.map(bicluster=>{
          let {question,participants}=bicluster
          participants=participants[0];

          let left,top,width,height;

          width=participants.length/peopleNumber
          height=question.length/q_order_all.length;
          for (let q_index=0;q_index<q_order_all.length;q_index++){
            const q=q_order_all[q_index];
            if (question.indexOf(q)!==-1) {
              top=q_index/q_order_all.length;
              break;
            }
          }
          for (let r_index=0;r_index<r_order_all.length;r_index++){
            const r=r_order_all[r_index];
            if (participants.indexOf(r)!==-1) {
              left=r_index/peopleNumber;
              break;
            }
          }
          return {
            left,top,width,height
          }
        })  //[left,top,width,height]

        bicluster.push({bicluster_shown_position,questionOrder,respondentOrder})
      })


      this.bicluster=bicluster;
      // this.$store.commit()
    },
    dataProcessing() {
      const data = this.$store.state;
      const { NODE, CHIGroup } = data;
      this.CHIGroup = CHIGroup;
      this.NODE = NODE;
      const links = [];
      const nodes = [];
      NODE.forEach((question) => {
        // console.log(question);
        nodes.push({
          name: question,
          value: 1000,
          itemStyle: {
            color: '#99CCFF',
          },
          symbolSize: 50,
        });
      });
      //   console.log(nodes);
      CHIGroup.forEach((group) => {
        for (
          let groupIndex = 0;
          groupIndex < group.length - 1;
          groupIndex += 1
        ) {
          links.push({
            source: group[groupIndex][0],
            target: group[groupIndex + 1][0],
            value: 10,
            lineStyle: {
              color: '#000',
            },
          });
        }
        links.push({
          source: group[group.length - 1][0],
          target: group[0][0],
          value: 10,
          lineStyle: {
            color: '#000',
          },
        });
      });
      this.nodes = nodes;
      this.links = links;
    },
    setMatrixPosition() {
      const link = [[1, 2], [3, 4]];
      const { matrixTranslate } = this;
      console.log(link, matrixTranslate, this.matrixList, 'matrixTranslate');
      this.matrixList.forEach((matrix, index) => {
        matrix.graph.attr('transform', `translate(${matrixTranslate[index][0]},${matrixTranslate[index][1]})`)
          .on('mouseup', () => {
            console.log(index, 'up');
            this.svg.call(this.zoom);
            this.changeGroup(this.selectedQuestion, index);
          });
      });
    },
  },
};
</script>

<style>
#forceGraph {
    width: 150%;
    height: 300%;
    transform: translate(-20%,-30%);
}

.axis line{
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.tick text {
    /* transform: rotate(45deg); */
    transform-box: fill-box;
    cursor:pointer;
    font-family: sans-serif;
    font-size: 12px;
    user-select:none;
}

.axisBottom .tick text{
  transform-origin:left;
}

.axisTop .tick text{
  transform-origin:right;
}

.axisLeft .tick text{
  transform:translate(-5px,5px); /*rotate(45deg);*/
  transform-origin:right;
}

.axisRight .tick text{
  transform:translate(5px,-5px);/*rotate(45deg);*/
  transform-origin:left;
}

.cardTitle{
  background-color: rgb(231, 231, 231);
  border-radius:5px;
  color: black;
  font-family: Sans-serif;
}
</style>
