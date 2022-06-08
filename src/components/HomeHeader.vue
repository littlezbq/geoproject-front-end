<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="0">
        <router-link to="/">首页</router-link>
      </el-menu-item>
      <el-menu-item index="1"> 村落自动分类 </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/autoSortingPage">营建显著性点位发掘</router-link>
      </el-menu-item>
      <el-menu-item index="3"> 村落宜居区域发掘 </el-menu-item>
      <el-menu-item index="4"> 村落营建基因发掘 </el-menu-item>
      <el-menu-item index="5"> 
        <router-link to="/wyPage">山形可视化</router-link> 
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'HomeHeader',
  data () {
    return {
      activeIndex:'0'
    }
  },
  methods:{
     handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
  }
}
</script>

<style>
.homeHeader {
  margin-top: 0px;
}
/* .el-menu-demo{
  height: 10vh;
} */
</style>
