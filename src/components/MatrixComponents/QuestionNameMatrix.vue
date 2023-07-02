<template>
    <g>
        <text
            :transform="'translate(5 '+(index+0.9)*size+')'"
            v-for="(item,index) in nameArr"
            :key="index"
            @mouseover="nameOver(index,item)"
            @mouseleave="nameLeave"
            @click="nameClick(item)"
        >{{item}}</text>
        <text class="t" v-if="this.tooltip" :transform="tooltipTransform">{{tooltipQuestion}}</text>
    </g>
</template>

<script>
import * as util from '../../util/util';

export default {
  props: ['groupId'],
  data() {
    return {
      tooltip: false,
      tooltipQuestion: '',
      tooltipTransformY: 0,
    };
  },
  computed: {
    tooltipTransform() {
      return `translate(50  ${this.tooltipTransformY})`;
    },
    nameArr() {
    //   console.log('groupId', this.groupId, this.$store.state);
      if (this.groupId === -1) return [];
      const { state } = this.$store;
      //   console.log(
      //     state.groupArr[this.groupId].map(
      //       (x) => state.Question[state.NODE[x]],
      //     ),
      //   );
      //   return state.groupArr[this.groupId].map(
      //     (x) => state.Question[state.NODE[x]],
      //   );
      return state.groupArr[this.groupId].map((x) => state.NODE[x]);
    },
    colorArr() {
      return this.nameArr.map((name) => {
        // eslint-disable-next-line no-unused-vars
        const id = util.name2Id(name);
        // return this.$store.state.problemColArr[this.$store.state.questionTypeList[id]];
        return '#000000';
      });
    },
    size() {
      return this.$store.state.size;
    },
  },
  mounted() {},
  methods: {
    nameOver(index, item) {
    //   console.log(index);
      this.tooltipTransformY = index * this.size + 20;
      this.tooltipQuestion = this.$store.state.Question[item];
      this.tooltip = true;
    },
    nameLeave() {
      this.tooltip = false;
    },
    nameClick(item) {
      this.$store.dispatch('selectNodeinGraph', util.name2Id(item));
    },
  },
};
</script>

<style scoped>
.t {
    background-color: aliceblue;
}

text{
  font-family: sans-serif;
  font-size: 20px;
}
</style>
