<template>
<div style="height:100%">
    <div id='questionView'>
        <div
        v-for="(item,index) in question" :key="'question'+index"
        @click="click(index)" @mousemove="move($event,index)" @mouseout="leave" @mouseleave="leave">
          <div class='question' v-show="visibleArr[index]">
                      <div class='questionText'>{{item}}</div>
                      <!-- <i class="el-icon-delete" @click.stop="delQuestion(index)"/> -->
          <br/>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import * as d3 from 'd3';
import * as util from '../util/util';
import CardTitle from './utilComponents/CardTitle.vue';

export default {
  name: 'question',
  components: { CardTitle },
  data: () => ({
    visibleArr: new Array(100).fill(true),
  }),
  mounted() {
  },
  computed: {
    question() {
      const nameList = Object.keys(this.$store.state.Question);
      return nameList.map((x) => `${x}:${this.$store.state.Question[x]}`);
    },
  },
  methods: {
    click(index) {
      this.$store.dispatch('selectNodeinGraph', util.name2Id(`Q${index}`));
      // this.$store.commit('commitScreenCenterQuestionId', util.name2Id(`Q${index}`));
    },
    move(e, index) {
      // d3.select('#tooltip')
      //   .style('left', `${e.clientX + 10}px`)
      //   .style('top', `${e.clientY + 10}px`)
      //   .style('z-index', 20)
      //   .style('display', 'inline')
      //   .text(`hello${index}`);
    },
    leave() {
      d3.select('#tooltip')
        .style('display', 'none');
    },
    delQuestion(index) {
      console.log('clickdel');
      this.$set(this.visibleArr, index, false);
    },
  },
};
</script>

<style scoped>

i{
  z-index: 9;
  position: absolute;
  right:20px;
}

i:hover{

  border-radius:25px;
  background-color:rgb(200 ,200,200);
}

.question{
  position: relative;
  cursor: pointer;
width:100%;
border-bottom: 1px dashed #ccc;
}

.question::after{
  content: 111;
}

.question:hover{
border-radius:25px;
  background-color:rgb(224, 224, 224);
}

.questionText{
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 2%;
}

#questionView{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
#questionView::-webkit-scrollbar {
        display: none;
    }
</style>
