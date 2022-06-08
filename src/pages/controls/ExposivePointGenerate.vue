<template>
  <!-- 
    Component to generate exposivepoints
 -->
  <div>
    <h4 style="margin:0px 1px 0px 1px;">计算暴露点</h4>
    <el-select 
        v-model="exposivePointNum" 
        placeholder="暴露点数量" 
        size="small" 
        @change="catExposivePointNum"
    >
        <el-option 
            v-for="item in options2" 
            :key="item.exposivePointNum" 
            :label="item.label" 
            :value="item.exposivePointNum"
        >
        </el-option>
    </el-select>

    <el-button 
        style="margin-left: 0px; width: 100px;" 
        size="small" 
        type="success" 
        @click="calExposivePoint"
    >计算暴露点
    </el-button>

 </div>
</template>

<script>
import axios from "axios"; 
export default {
    name:'ExposivePointGenerate',
    data(){
        return{
            canSee:false,
            loadPage:{},
            options2:[{
                exposivePointNum:"1",
                label:"1"
            },{
                exposivePointNum:"5",
                label:"5"
            },{
                exposivePointNum:"10",
                label:"10"
            }],
        }
    },
    methods:{
        // 抓取暴露点数量
        catExposivePointNum(setVal){
            this.$store.commit('modifyExposivePointNum',setVal)
            console.log("暴露点数量：" + setVal);
        },
        // 计算登临点
        calExposivePoint(){
            this.loadPage=this.$loading({
                    lock: true,
                    text: '处理中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
            });
            this.canSee = true;
            axios
                .post("/calExposivePoint", {"exposivePointNum":this.$store.getters.getExposivePointNum}).then((response) => {
                    if (response.data.result.code === 0) {
                        this.$message({
                            message: "计算成功",
                            type: 'success'
                        })
                    
                        // 获取到需要的登临点经纬度坐标及可视域文件存在的路径，根据鼠标点击实时加载出目标登临点的可视域
                        var ExposivePointCoords = response.data.result.exposivepoint_numlist_absolute;
                        
                        // 将登临点列表和可视域文件基路径存入vuex中
                        this.$store.commit("modifyExposivePointCoords",ExposivePointCoords);

                        if (ExposivePointCoords != ''){
                            this.$store.state.exposivePointFunction();
                        }

                } else {
                    this.$message({
                    message: "计算失败",
                    type: 'error'})
                }
                this.loadPage.close()
                this.canSee = false;
            })
        },
    }

}
</script>

<style>

</style>