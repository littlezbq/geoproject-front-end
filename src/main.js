import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import './plugins/element.js'

import router from './router/index'

Vue.config.productionTip = false
Vue.use(VueRouter)




// 引入store
import store from './store/index'

new Vue({
  render: h => h(App),
  router:router,
  store:store
}).$mount('#app')
