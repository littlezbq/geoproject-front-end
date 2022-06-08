<template>
    <div>
        <h4 style="margin:0px 1px 0px 1px;">计算可达域</h4>
        <el-select
            v-model="time_limit"
            placeholder="步行时间"
            size="small"
            @change="catTimeLimit"
        >
            <el-option
            v-for="item in options1"
            :key="item.time_limit"
            :label="item.label"
            :value="item.time_limit"
            >
            </el-option>
        </el-select>

        <el-input
            v-model="demAxis"
            placeholder="dem精度"
            size="small"
            clearable
        >
        </el-input>

        <el-button
            style="margin-left: 0px; width: 100px"
            size="small"
            type="success"
            @click="distantCalc"
            >可达域计算</el-button
        >
    </div>
</template>

<script>
import axios from "axios";
export default {
    name:'AccessAblityCalculate',
    data(){
        return{
            canSee:false,
            loadPage:{},
            options1:[{
                time_limit:"15",
                label:"15min"
                },{
                time_limit:"30",
                label:"30min"
                },{
                time_limit:"45",
                label:"45min"
                },{
                time_limit:"60",
                label:"60min"
            }],
            demAxis:""
        }
    },

    methods:{
        catTimeLimit(selVal) {
            this.$store.commit('modifyTimeLimit',selVal)
            console.log("选择的value为：" + this.time_limit);
        },
        distantCalc(){
            this.loadPage=this.$loading({
                    lock: true,
                    text: '处理中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
            });
            this.canSee = true;
            axios
                .post("/distantCalc", {"time_limit" : this.$store.getters.getTimeLimit, "demAxis":this.demAxis})
                .then((response) => {
                    if (response.data.result.code === 0) {
                    this.$message({
                        message: "计算成功",
                        type: 'success'
                    })
                    
                    // Put centerpoint, accessdomain_path and location to vuex
                    this.$store.commit('modifyCenterPoint',response.data.result.centerpoint)
                    this.$store.commit('modifyAccessDomain',response.data.result.accessdomain_path)
                    this.$store.commit('modifyVillageLocation', response.data.result.location)
                    
                    // 
                    if (response.data.result.accessdomain_path != '')
                        this.$store.state.accessDomainFunction()

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
};
</script>

<style>
</style>