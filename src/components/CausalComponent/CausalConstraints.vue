<template>
  <el-popover
          trigger="click"
          style="padding-left:0px">
          <el-input
            type="textarea"
            v-model="causalConstraints"
            :autosize="{ minRows: 5, maxRows: 10}"
            @blur="finishInput">
          </el-input>
          <button slot="reference" icon="el-icon-edit">Constraints</button>
          <button slot="reference" icon="el-icon-edit">Show all</button>
          <button slot="reference" icon="el-icon-edit">Show causes</button>
    </el-popover>
</template>

<script>
export default {
  name: 'causalConstraints',
  data() {
    return {
      causalConstraints: '',
    };
  },
  methods: {
    finishInput() {
      // if (this.causalConstraints === 'all') this.commit('updateCausalAll', true);
      // else this.commit('updateCausalAll', false);
      const constrainArr = this.causalConstraints.split(/\r?\n/);
      console.log(constrainArr);
      const parseAddNodeArr = [];
      const parseConstrains = { requiredirect: [], forbiddendirect: [], target: [], source: [] };
      constrainArr.forEach((constrain) => {
        if (constrain.startsWith('Target:')){
          parseConstrains.target.push(constrain.split('Target:')[1]) // split res: ['','QXX']
          return;
        }
        if (constrain.startsWith('Source:')){
          parseConstrains.source.push(constrain.split('Source:')[1])
          return;
        }
        const r = constrain.split('-->');
        const f = constrain.split('!->');
        console.log(constrain, 'cons');
        if (r.length > 1) {
          parseConstrains.requiredirect.push([r[0], r[1]]);
          parseAddNodeArr.push(Number(r[0]));
          parseAddNodeArr.push(Number(r[1]));
        } else if (f.length > 1) {
          parseConstrains.forbiddendirect.push([f[0], f[1]]);
          parseAddNodeArr.push(Number(f[0]));
          parseAddNodeArr.push(Number(f[1]));
        } else if (constrain !== '') parseAddNodeArr.push(Number(constrain));
      });
      this.$store.commit('updateCausalConstraints', parseConstrains);
      this.$store.commit('updateCausalAddNode', Array.from(new Set(parseAddNodeArr)));
    },
  },
};
</script>

<style>

</style>
