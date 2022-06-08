<template>
  <div>
    <el-aside width="110px" class="aside">
      <img
        style="margin: 5px 1px 0px 1px;"
        :src="clickPic"
        width="80px"
      />
      <div>
        
        <h4 style="margin:0px 1px 0px 1px;">请上传数据</h4>
        <i v-if="canSee" class="el-icon-loading"></i>
        <h1 v-if="canSee">处理中...</h1>
      <!-- 等待注册的组件 -->
      <UploadFiles/>
      <AccessAblityCalculate/>
      <AscensionPointGenerate/>
      <ExposivePointGenerate/>
      </div>
    </el-aside>
  </div>
</template>

<script>
import UploadFiles from '../pages/controls/UploadFiles.vue'
import AccessAblityCalculate from '../pages/controls/AccessAblityCalculate.vue'
import AscensionPointGenerate from '../pages/controls/AscensionPointGenerate.vue'
import ExposivePointGenerate from '../pages/controls/ExposivePointGenerate.vue'
export default {
    name:'BandSide',
    data(){
        return{
            clickPic:require('../assets/click.png'),
        }
    },
    methods:{

    },
    components:{
      UploadFiles,
      AccessAblityCalculate,
      AscensionPointGenerate,
      ExposivePointGenerate
    }
};
</script>

<style>
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 50px;
  /* height: 100%; */
  height: 93vh;
}
.el-input {
  width: 100px;
}

</style>