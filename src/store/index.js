// 该文件用于创建vuex中的核心store
// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 使用Vuex
Vue.use(Vuex) 
// 准备actions，用于响应组件中的动作
const actions = {
    

}

// 准备mutations，用于操作数据
const mutations = {
    // 修改图片路径，value是几就修改哪一条
    // values格式为['imgPath',No]
    modifyImageUrls(state,values){
        state.imgUrls['imageUrl' + values[1].toString()] = values[0].toString()
    },

    // 修改跳转中心点坐标
    modifyCenterCoord(state,values){
        state.centerCoord = values
    },

    // 绑定cesium中的相机跳转函数
    setPageFunction(state,payload){
        state.pageFunction = payload
    },

    // 修改可达域时间值
    modifyTimeLimit(state,value){
        state.time_limit = value
    },

    
    
    // 修改村落中心点坐标
    modifyCenterPoint(state,centerpoint){
        state.centerpoint = centerpoint
    },

    // 修改可达域图像路径
    modifyAccessDomain(state,accessdomain_path){
        state.accessdomain_path = accessdomain_path
    },

    // 绑定cesium中可达域显示的函数
    setAccessDomain(state, payload){
        state.accessDomainFunction = payload
    },

    // 修改显示的登临点数量
    modifyAscensionPointNum(state,value){
        state.ascensionPointNum = value
    },

    modifyVillageLocation(state, value){
        state.location = value
    },

    // 修改登临点列表
    modifyAscensionPointCoords(state, ascensionPointCoords){
        state.coords = ascensionPointCoords;
    },

    // 绑定cesium中登临点显示的函数
    setAscensionPoint(state, payload){
        state.ascensionPointFunction = payload;
    },

    // 修改可视域文件路径
    modifyViewShedUrl(state, viewshedUrls){
        state.viewshedUrls = viewshedUrls;
    },

    // 修改暴露点数量
    modifyExposivePointNum(state, exposivePointNum){
        state.exposivePointNum = exposivePointNum;
    },

    // 修改暴露点列表
    modifyExposivePointCoords(state, exposivePointCoords){
        state.coords = exposivePointCoords;
    },

    // 绑定cesium中暴露点显示的函数
    setExposivePoint(state, payload){
        state.exposivePointFunction = payload;
    }


}

// 准备state，用于存储数据
const state = {
    space:'',
    // 目前要使用的静态资源路径
    imgUrls:{
        imageUrl1:'',
        imageUrl2:'',
    },
    // 可达域
    accessdomain_path:'',

    // cesium相机跳转的中心点坐标
    centerCoord:{},

    // 村落中心点
    centerpoint:{},

    // 共享坐标对象集：包括可达域、登临点、暴露点等
    coords:{},

    // 设置的步行可达域时长限制
    time_limit:0,

    // 从选择器捕捉到的登临点数字大小
    ascensionPointNum:0,

    // 从选择器捕捉到的暴露点数字大小
    exposivePointNum:0,

    // 村落经纬度范围
    location:{},

    // 可视域文件路径列表
    viewshedUrls:{},

    // CesiumDemo中跳转到指定村落的函数
    pageFunction:{},

    // Control to display accesspoints in CesiumDemo
    accessDomainFunction:{},

    // CesiumDemo中显示登临点的函数
    ascensionPointFunction:{},

    // CesiumDemo中显示暴露点的函数
    exposivePointFunction:{},
}

const getters = {
    getImgUrls(state){
        return state.imgUrls
    },
    getCoords(state){
        return state.coords
    },
    getTimeLimit(state){
        return state.time_limit
    },
    getAccessDomain(state){
        return state.accessdomain_path
    },
    getCenterPoint(state){
        return state.centerpoint
    },
    getAscensionPointNum(state){
        return state.ascensionPointNum
    },
    // getAscensionPointList(state){
    //     return state.coords
    // },
    getViewShed(state){
        return state.viewshedUrls
    },

    getExposivePointNum(state){
        return state.exposivePointNum
    },

    getVillageLocation(state){
        return state.location
    }

}


export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})