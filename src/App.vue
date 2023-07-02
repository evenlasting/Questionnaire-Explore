<template>
    <div :style="background" id="app" v-loading.fullscreen.lock="fullScreenLoading">
      <img :src="imgSrc" width="1854px" height="1038px"/>
      <div id='tooltip'></div>
      <el-card v-if="!fullScreenLoading" shadow="never" id='question'
        class="box-card" :body-style="bodyCardStyle">
            <Question/>
      </el-card>
      <el-card v-if="!fullScreenLoading" shadow="never" id="graph"
        class="box-card"  :body-style="bodyCardStyle">
            <Graph />
      </el-card>
      <!-- <el-card v-if="!fullScreenLoading" shadow="never" id="sankey"
        class="box-card"   :body-style="bodyCardStyle">
            <Causal />
      </el-card> -->
      <el-card v-if="!fullScreenLoading" shadow="never" id="sankey"
        class="box-card"   :body-style="bodyCardStyle">
            <Causal />
      </el-card>
      <div v-if="!fullScreenLoading" shadow="never" id="matrix">
            <Matrix />
      </div>
      <el-card v-if="!fullScreenLoading" shadow="never" id="setting"
        class="box-card"  :body-style="bodyCardStyle">
          <Settings />
      </el-card>
      <div v-if="!fullScreenLoading" shadow="never" id='arc'
        class="box-card" :body-style="bodyCardStyle">
            <Arc/>
    </div>
        <div id="del" v-if="false">
            <div style="margin-top: 15px;">
                <el-input placeholder="Qid" v-model="input2">
                    <el-button slot="append" icon="el-icon-remove-outline"
                    @click="delNode"></el-button>
                    <el-button slot="prepend" icon="el-icon-circle-plus-outline"
                    @click="addNode"></el-button>
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
import Question from './components/Question.vue';
import Settings from './components/Settings.vue'
import Matrix from './components/UpsetManager.vue';
import Causal from './components/Causal.vue';
import Graph from './components/Graph.vue';
import Arc from './components/Arc.vue';
import * as util from './util/util';
import CardTitle from './components/utilComponents/CardTitle.vue'

export default {
  name: 'App',
  data() {
    return {
      input2: null,
      input3: null,
      bodyCardStyle: 'height:100%; padding:8px',
      value2: 3,
      value1: 0.1,
      imgSrc: require('./assets/background.png'),
    };
  },
  computed: {
    fullScreenLoading() {
      console.log('finish loading');
      return this.$store.state.fullScreenLoading;
    },
  },
  mounted() {
    this.$store.commit('updateLoading', true);
    this.$store.dispatch('dataRequest', { question: [], people: [] });
  },
  components: {
    Matrix, Causal, Graph, Arc, Question, CardTitle, Settings,
  },
  methods: {
    delNode() {
      const nodeid = util.name2Id(this.input2);
      this.$store.commit('delNode', nodeid);
    },
    addNode() {
      const nodeid = util.name2Id(this.input2);
      this.$store.commit('addNode', nodeid);
    },
  },
};
</script>

<style>
#tooltip {
    /* outline: .6em solid #655; */
    box-shadow: 0 0 0 .4em rgb(0, 0, 0);
    max-width: 10em;
    border-radius: .8em;
    padding: 1em;
    margin: 1em;
    background: white;
    font: 100%/1.5 sans-serif;
    position: fixed;
    display: none;
}

.littleHead{
  color: #fff;
  font-family: sans-serif;
  line-height: 1.5;
  z-index: 98;
  padding-left: 1%;
  padding-right: 1%;
  font-size: 1.2pc;
  border-radius:25px;
  font-weight: bold;
}

#questionHead{
  position: fixed;
  background-color: rgb(34, 34, 34);
  top:6%;
  left: 2%;
}
#OverviewHead{
  position: fixed;
  background-color: rgb(34, 34, 34);
  top:6%;
  left: 23%;
}
#CausalHead{
  position: fixed;
  background-color: rgb(34, 34, 34);
  top:6%;
  left: 75%;
}
#HypergraphHead{
  position: fixed;
  background-color: rgb(34, 34, 34);
  top:59%;
  left: 35%;
}
#RespondentHead{
  position: fixed;
  background-color: rgb(34, 34, 34);
  top:59%;
  left: 2%;
}

#head{
  top:0%;
  left: 0%;
  right: 0%;
  position: fixed;
  background-color: rgb(34, 34, 34);
  height:4%;
  text-align: center;
  font-size: 1.8pc;
  color: #fff;
  font-family: sans-serif;
  font-weight: bold;
  line-height: 1.5;
}

#search{
  top:0%;
  left: 10%;
  height: 10%;
  width:10%;
  z-index: 99;
  position:fixed;
}

#del{
  top:5%;
  right: 3%;
  height: 10%;
  width:10%;
  z-index: 99;
  position:fixed;
}

#app {
  top:0%;
  left: 0%;
    height: 2000px;
    width: 100%;
    position: fixed;
    background-color: #fff;

}

#question { 
    /* background-color: #ffffff; */
    /*height: 39%;  */
    height: 497px;
    /* width: 16%;  */
    width: 365px;
    /* top: 12%;  */
    top: 153px;
    /* left: 1%;  */
    left: 23px;
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
     /* border: medium solid #555555; */
}

#question::-webkit-scrollbar {
    display: none;
}

#graph {
    /* background-color: #ffffff; */
    /* height: 55%; */
    height: 0%;
    /* width: 51%; */
    width: 0%;
    top: 1%;
    left: 22%;
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
    /* border: medium solid #555555; */
}
#sankey {
    /* background-color: #ffffff; */
    /* height: 42%; */
    height: 530px;
    /* width: 22%; */
    width: 500px;
    /* top: 9%; */
    top: 113px;
    /* right: 19.5%; */
    left: 1330px;
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
    /* border: medium solid #555555; */
}

#setting {
    /* background-color: #ffffff; */
    /* width: 16%;  */
    width: 365px;
    /* height: 22%;  */
    height: 280px;
    /* left: 1%;  */
    left: 23px;
    top: 738px;
    /* bottom: 20%; */
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
    /* border: medium solid #555555; */
}
#matrix {
    /* background-color: #ffffff; */
    /* height: 32%; */
    /* height: 68.8%; */
    height: 877px;
    /* bottom: 20%; */
    top: 128px;
    /* left: 20%; */
    left: 455px;
    /* right: 30%; */
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
    /* border: medium solid #555555; */
}
#arc{
    /* background-color: #ffffff; */
    /* height: 26%; */
    height: 330px;
    /* bottom: 18%; */
    top: 710px;
    /* width:32%; */
    /* left: 1%; */
    /* width: 38%; */
    width: 870px;
    /* right: 5%; */
    left: 1295px;
    position: fixed;
    /* box-shadow: 10px 10px 5px #888888; */
    /* border: medium solid #555555; */
}

</style>
