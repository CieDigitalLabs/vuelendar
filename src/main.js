// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import 'bootstrap';
import 'font-awesome/css/font-awesome.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueLogger, {
  logLevel: 'debug',
  // optional : defaults to false if not specified
  stringifyArguments: false,
  // optional : defaults to false if not specified
  showLogLevel: false,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
