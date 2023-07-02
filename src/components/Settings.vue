<template>
  <div>
		<div>
			<span class="settings-text">Dataset: </span>
			<el-button 
				class="file-text" 
				type="info" 
				plain
				@click="uploadClick"
			>
				{{getFileName()}}
			</el-button>
			<el-upload 
				style="display: none" 
				action="" 
				:before-upload="readDataFile"
				accept=".csv, .xls, .xlsx"
			>
				<el-button ref="uploadInnerButton" style="display: none" type="primary"></el-button>
			</el-upload>
		</div>
		<div style="margin-top: 8px;">
			<span class="settings-text">Max number of questions: {{maxQuestionNumber}}</span>
			<el-slider 
				:min="1" 
				:max="7" 
				:step="1" 
				show-stops
				v-model="maxQuestionNumber" 
				@change="updateMaxNumber"
			></el-slider>
		</div>
		<div style="margin-top: 2px;">
			<span class="settings-text">Constraints:</span>
			<el-input
				type="textarea"
				v-model="causalConstraintsInput"
				:autosize="{ minRows: 5, maxRows: 10 }"
				@blur="applyCausal"
				style="margin-top: 8px"
			>
			</el-input>
		</div>
    <!-- <button @click="applyCausal">
          apply causal comstraints
        </button> -->
    <!-- </el-input> -->
  </div>
</template>

<script>
import * as util from '../util/util';

export default {
	name: 'settings',
	data() {
		return {
			fileName: '',
			maxQuestionNumber: this.$store.state.maxQuestionNumber,
			causalConstraintsInput: '',
		}
	},
	mounted() {
		this.fileName = 'StudentSurvey.csv'
	},
	methods: {
		getFileName() {
			return this.fileName.length > 0 ? this.fileName : 'Select File'
		},
		readDataFile(file) {
			// read data file
			console.log(file);
			return false;
		},
		uploadClick() {
			this.$refs.uploadInnerButton.$el.click(); 
		},
		updateMaxNumber(value) {
			this.$store.commit('updateMaxQuestionNumber', value);
		},
		parseConstraints(causalConstraints) {
			// if (this.causalConstraints === 'all') this.commit('updateCausalAll', true);
			// else this.commit('updateCausalAll', false);
			const constrainArr = causalConstraints.split(/\r?\n/);
			const parseAddNodeArr = [];
			const parseConstrains = { requiredirect: [], forbiddendirect: [], target: [], source: [] };
			constrainArr.forEach((constrain) => {
				if (constrain.startsWith('Target:')){
					parseConstrains.target.push(util.name2Id(constrain.split('Target:')[1])) // split res: ['','QXX']
					return;
				}
				if (constrain.startsWith('Source:')){
					parseConstrains.source.push(util.name2Id(constrain.split('Source:')[1]))
					return;
				}
				const r = constrain.split('-->');
				const f = constrain.split('!->');
				if (r.length > 1) {
					parseConstrains.requiredirect.push([util.name2Id(r[0]), util.name2Id(r[1])]);
					// parseAddNodeArr.push(Number(r[0]));
					// parseAddNodeArr.push(Number(r[1]));
				} else if (f.length > 1) {
					parseConstrains.forbiddendirect.push([util.name2Id(f[0]), util.name2Id(f[1])]);
					// parseAddNodeArr.push(Number(f[0]));
					// parseAddNodeArr.push(Number(f[1]));
				} else if (constrain !== '') {
					parseAddNodeArr.push(Number(util.name2Id(constrain)));
				}
			});
			this.$store.commit('updateCausalConstraints', parseConstrains);
			this.$store.commit('updateCausalAddNode', Array.from(new Set(parseAddNodeArr)));
		},
		applyCausal(){
			this.parseConstraints(this.causalConstraintsInput)
		},
	}
};
</script>

<style scoped>

.settings-text {
	font-size: 20px;
	font-weight: 600;
}

.file-text {
	width: 250px;
	margin-left: 6px;
	font-size: 18px;
	font-weight: 600;
}

</style>