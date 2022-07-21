<template>
<!-- 
    Component to generate ascensionpoints
 -->
  <div>
    <h4 style="margin:0px 1px 0px 1px;">计算登临点</h4>
    <el-select 
        v-model="ascensionPointNum" 
        placeholder="登临点数量" 
        size="small" 
        @change="catAscensionPointNum"
    >
        <el-option 
            v-for="item in options2" 
            :key="item.ascensionPointNum" 
            :label="item.label" 
            :value="item.ascensionPointNum"
        >
        </el-option>
    </el-select>

    <el-input
        placeholder="计算间隔"
        v-model="divideSpace"
        size="small"
        clearable>
    </el-input>

    <el-button 
        style="margin-left: 0px; width: 100px;" 
        size="small" 
        type="success" 
        @click="calAscensionPoint"
    >计算登临点
    </el-button>

 </div>

</template>

<script>
import axios from "axios"; 
export default {
    name:'AscensionPointGenereate',
    data(){
        return{
            // ascensionPointNum:'',
            canSee:false,
            loadPage:{},
            options2:[{
                ascensionPointNum:"1",
                label:"1"
            },{
                ascensionPointNum:"5",
                label:"5"
            },{
                ascensionPointNum:"100",
                label:"100"
            }],
            divideSpace:"",
        }

    },
    methods:{
        // 抓取登临点数量
        catAscensionPointNum(setVal){
            this.$store.commit('modifyAscensionPointNum',setVal)
            console.log("登临点数量：" + setVal);
        },
        // 计算登临点
        calAscensionPoint(){
            this.loadPage=this.$loading({
                    lock: true,
                    text: '处理中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
            });
            axios
                .post("/calAscensionPoint", {"ascensionPointNum":this.$store.getters.getAscensionPointNum, "divideSpace": this.divideSpace}).then((response) => {
                    if (response.data.result.code === 0) {
                        this.$message({
                            message: "计算成功",
                            type: 'success'
                        })
                    
                        // 获取到需要的登临点经纬度坐标及可视域文件存在的路径，根据鼠标点击实时加载出目标登临点的可视域
                        var ascensionPointCoords = response.data.result.ascension_point_list;
                        var ascensionpoint_viewshedpathlist = response.data.result.ascensionpoint_viewshedpathlist;
                        
                        // 将登临点列表和可视域文件基路径存入vuex中
                        this.$store.commit("modifyAscensionPointCoords",ascensionPointCoords);
                        this.$store.commit("modifyViewShedUrl", ascensionpoint_viewshedpathlist);

                        if (ascensionPointCoords != ''){
                            this.$store.state.ascensionPointFunction()
                        }

                } else {
                    this.$message({
                    message: "计算失败",
                    type: 'error'})
                }
                this.loadPage.close()
            })
        },
    }
};
</script>

<style>
</style>