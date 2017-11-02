import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';

import Vuex from 'vuex';
import store from './vuex/store';
import "babel-polyfill";

Vue.use(Vuex)
Vue.use(iView)

Vue.config.productionTip = false

import '@/theme/iview.css';
import "@/assets/css/animate.css";
import "@/assets/css/main.css";
import "@/assets/css/public.css";

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})