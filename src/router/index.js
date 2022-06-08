// 该文件用来专门创建整个应用的路由器
import VueRouter from 'vue-router'
// 引入组件
import AutoSortingPage from '../pages/AutoSortingPage'
import HomeMain from '../pages/HomeMain'
import WyPage from '../pages/WyPage'

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: HomeMain
    },
    {
      path: '/autoSortingPage',
      component: AutoSortingPage
    },
    {
      path:'/wyPage',
      component: WyPage
    }
  ]
})
