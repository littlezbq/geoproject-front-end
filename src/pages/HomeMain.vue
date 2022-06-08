<template>
  <div>
    <el-main>
      <div>
          <h1 class="textCenter">传统村落绿色宜居营建基因挖掘系统</h1>
          <p class="textCenter">Author</p>
          <div class="imgCenter">
            <img :src="imgSrc"/>
          </div>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'HomeMain',
  data () {
    return {
      imgSrc: require('../assets/QMC.png')
    }
  }
}
</script>

<style>
  .textCenter{
    text-align: center;
  }
  .imgCenter{
    display:flex;
    justify-content: center; 
    align-items: center;
  }
</style>
