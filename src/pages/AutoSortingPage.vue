<template>
    <div>
        <el-container>
            <BandSide/>
            <el-main>
                <div class="center" >
                    <CesiumDemo/>
                </div>             
            </el-main>
        </el-container>
    </div>
</template>

<script>
// 加入canvas代码提示
/** @type {HTMLCanvasElement} */ 
import BandSide from "../components/BandAside.vue"
import CesiumDemo from "../pages/CesiumDemo.vue"
    export default {
        name:'AutoSortingPage',
        data(){
            return{
                showrowdemo:false
            }
        },

        components:{
            BandSide,
            CesiumDemo
        },
        


    }
</script>

<style>
.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    line-height: 50px;
}
.picStyle{
    border:1px solid #d3d3d3;
    width: 256px;
    height: 256px;
}
.center{
    width: 100%;
    height:90%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.rowDemo{
    width: 100%;
    height:50%;
}
</style>
