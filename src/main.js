import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import './filters'
import 'amfe-flexible'
import './utils/vant'
import './utils/cropper'


import './styles/base.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
