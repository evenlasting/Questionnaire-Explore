import Vue from 'vue';
import ElementUI from 'element-ui';
import * as echarts from 'echarts';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app');
