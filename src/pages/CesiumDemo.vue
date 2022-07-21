<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widgets from "cesium/Widgets/widgets.css";
export default {
  name: "CesiumDemo",
  data() {
    return {
      viewer: null,
      accesspointsLayer:null,
      viewshedpointsLayer:null,
      exposivepointsLayer:null,
    };
  },
  mounted() {
    // 创建Cesium实例
    this.cesiumInit();
    // 初始化配置参数
    this.configInit();

    // 加载地形服务
    this.terrainSerivce();
    // 加载影像服务
    this.imageService();

    // 将跳转指定村落的函数加入到vuex中
    this.$store.commit("setPageFunction", this.viewerFly);
    
    // 将展示可达域层的函数加入到Vuex中
    this.$store.commit("setAccessDomain", this.addAccessPointsLayer);

    // 将显示登临点的函数加入到vuex中
    this.$store.commit("setAscensionPoint",this.showAscensionPoints);

    // 将显示暴露点的函数加入到vuex中
    this.$store.commit("setExposivePoint", this.showExposivePoints);

  },


  methods: {
    // 创建cesium实例
    cesiumInit(){
      // 设置注册token并创建Ceisum初始地球
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmODE5ZmVkOS0zMzNkLTRhZDItYmE1NS1iOWU5MjA4ZDYwNzgiLCJpZCI6NjA3MzQsImlhdCI6MTYyNTQwNjc2M30.AhvFT18WWD0biep1Le_7RHXRwBXrtQb6U2ihTnhH1nM";

      this.viewer = new Cesium.Viewer("cesiumContainer",{
        // infoBox: false,
      });

       // 加载中国行政区规划json文件
      this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/static/shape_files/全国行政区划geojson.json',{
        name:'全国行政区图',
        stroke:Cesium.Color.WHITE,

        strokeWidth:5,

        fill:Cesium.Color.RED.withAlpha(0.04)

        // fill:new Cesium.Color(0, 0, 0, 0)//设置纯透明后，必须点击到polygon边界才显示提示框

      }));

},
    // 初始化配置参数
    configInit() {
      // 隐藏一些属性
      this.viewer.animation._container.style.display = "none"; //隐藏掉时钟
      this.viewer.timeline.container.style.display = "none"; //隐藏时间轴
      this.viewer.fullscreenButton.container.style.display = "none"; //隐藏全屏按钮
      this.viewer.geocoder.container.style.display = "none"; //隐藏搜索按钮
      this.viewer.homeButton.container.style.display = "none"; //隐藏home按钮
      this.viewer.navigationHelpButton.container.style.display = "none"; //隐藏帮助按钮
      this.viewer.sceneModePicker.container.style.display = "none"; //隐藏切换二三维按钮
      this.viewer.baseLayerPicker.container.style.display = "none"; //隐藏切换底图按钮
      this.viewer._cesiumWidget._creditContainer.style.display = "none"; //隐藏logo

    //  定位到中国区域
      this.viewer.camera.setView({
        destination:Cesium.Cartesian3.fromDegrees(106.26667, 32.46667, 4000000.0),
        orientation:{
          heading: 6.283185307179586,
          // 视角
          pitch: -1.5686521559334161,
          roll: 0,
        }
      });

    //  加入青木川和太相寺的经纬度,封装成实体
    //  QMC
      var x1 = 105.5800297135;
      var y1 = 32.8313019808;
      this.viewer.entities.add({
        id:'QingMuChuan',
        position: Cesium.Cartesian3.fromDegrees(x1, y1),
        point: {
          show: true, // default
          color: Cesium.Color['YELLOW'], // default: WHITE
          pixelSize: 6, // default: 1
          outlineColor: Cesium.Color.BLACK, // default: BLACK
          outlineWidth: 1, // default: 0
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
          description:'QingMuChuan'
        },
        label : {
          text : '青木川村',
          font : '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth : 2,
          verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
          pixelOffset : new Cesium.Cartesian2(0, -9)
        }
      });

      //TXS
      var x2 = 110.0386451887;
      var y2 = 36.9124077765;
      this.viewer.entities.add({
        id:'TaiXiangSi',
        position: Cesium.Cartesian3.fromDegrees(x2, y2),
        point: {
          show: true, // default
          color: Cesium.Color['YELLOW'], // default: WHITE
          pixelSize: 6, // default: 1
          outlineColor: Cesium.Color.BLACK, // default: BLACK
          outlineWidth: 1, // default: 0
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
        },

        label : {
          text : '太相寺村',
          font : '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth : 2,
          verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
          pixelOffset : new Cesium.Cartesian2(0, -9)
        }

      });

      //柞水
      var x3 = 109.3719261804;
      var y3 = 33.5279698948;
      this.viewer.entities.add({
        id:'ZhaShui',
        position: Cesium.Cartesian3.fromDegrees(x3, y3),
        point: {
          show: true, // default
          color: Cesium.Color['YELLOW'], // default: WHITE
          pixelSize: 6, // default: 1
          outlineColor: Cesium.Color.BLACK, // default: BLACK
          outlineWidth: 1, // default: 0
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
        },
        label : {
          text : '柞水',
          font : '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth : 2,
          verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
          pixelOffset : new Cesium.Cartesian2(0, -9)
        }
      });



      //添加青木川注释信息
      this.viewer.entities.getById('QingMuChuan').description = '\
            <img\
              width="50%"\
              style="float:left; margin: 0 1em 1em 0;"\
              src="/static/img/QingMuChuan.png"/>\
            <p>\
             青木川，国家AAAA级旅游景区。因川道内遍布青木树（学名为桤树，又称旱冬瓜树、水冬瓜树。）而得名，因人物魏辅唐和古建筑而名声大振。\
            </p>\
            <p>\
              过去，魏辅唐的商号匾牌里就隐含了“辅唐盛世”，体现出他的理想；\
              因与众不同的土政策和宽松的环境，形成一个“世外桃源”，外地各行各业人士纷至沓来，被称为“青木城”。 \
            </p>\
            <p>\
              2014年，随着电视剧《一代枭雄》（何辅唐历史原型人物魏辅唐）的热播，许多人在寻找陕西省的“风雷镇”，其实就是青木川古镇。\
            </p>\
            <p>\
              2019年12月，第四批中国20世纪建筑遗产项目在北京公布，汉中市宁强县全国重点文保单位青木川魏氏庄园入选。\
            </p>\
            <p>\
              Source: \
              <a style="color: WHITE"\
                target="_blank"\
                href="https://baike.baidu.com/item/%E9%9D%92%E6%9C%A8%E5%B7%9D/22028?fr=aladdin">BaiDu</a>\
            </p>';

    //  添加太相寺注释信息
      this.viewer.entities.getById('TaiXiangSi').description = '\
            <img\
              width="50%"\
              style="float:left; margin: 0 1em 1em 0;"\
              src="/static/img/TaiXiangSi.png"/>\
            <p>\
             太相寺村位于陕西省延川县城西北方向的青平川中下游，距县城约15公里，东与甄家湾村， 西与十甲村相连，西南与刘家湾村相接。\
             全村户籍居民283户832人，村常住88户183人。村庄总土地面积约12平方公里，村落面积230亩，有耕地3300亩，林地5400亩，\
             其中退耕还林面积4600亩。整个村落建于北山山脚河湾处，整体布局为五梁四沟一平滩。\
            </p>\
            <p>\
              2019年6月6日，住房和城乡建设部、文化和旅游部、国家文物局、财政部、自然资源部、农业农村部将太相寺村列入第五批中国传统村落名录。\
              2020年7月16日，“中国传统村落太相寺村”正式挂牌。\
            </p>\
            <p>\
              太相寺会议<br>\
              1936年5月10日，毛泽东从杨家圪台村出发来到太相寺，在村民张克让的窑洞里住了10天。这期间，在太相寺寺院的一间房子里，\
              毛泽东主持召开了红军在陕北的团以上干部会议，会议总结了东征，部署了西征，批评与纠正了林彪等人在东征期间不顾大局所表现出的本位主义、\
              自由主义错误思想。5月18日，毛泽东、周恩来、彭德怀在太相寺联名发布了《关于西征战役的行动命令》。\
              5月21日，毛泽东、周恩来率领红军总部回到瓦窑堡，历时117天的渡河东征胜利结束。\
            </p>\
            <p>\
              Source: \
              <a style="color: WHITE"\
                target="_blank"\
                href="https://baike.baidu.com/item/%E5%A4%AA%E7%9B%B8%E5%AF%BA%E6%9D%91/23214959?fr=aladdin">BaiDu</a>\
            </p>';

    //  添加柞水注释信息
      this.viewer.entities.getById('ZhaShui').description = '\
            <img\
              width="50%"\
              style="float:left; margin: 0 1em 1em 0;"\
              src="/static/img/ZhaShui.png"/>\
            <p>\
             凤凰古镇，位于柞水县社川河畔，坐落在社川河、皂河沟、水滴沟三河出口交汇处“十字水”肥沃的三角洲上。背靠大梁山，面向凤凰山，\
             有五寨护卫的鱼米之乡，它是全县闻名的商贸古集镇，人口稠密的大镇，经济繁荣的强镇，更是人文灵气的富镇。307省道穿镇而过，交通便利。\
            </p>\
            <p>\
              凤凰古镇，历史悠久，文化底蕴深厚，旅游资源丰富。距今有1400年的历史，保存完好。以四合院为主、古建筑大体沿袭徽派建筑风格，较具地方特点。\
              2002年12月列入省级第四批“古建筑群居民”文物保护单位。\
            </p>\
            <p>\
              Source: \
              <a style="color: WHITE"\
                target="_blank"\
                href="https://baike.baidu.com/item/%E5%87%A4%E5%87%B0%E5%8F%A4%E9%95%87/3678350?fr=aladdin">BaiDu</a>\
            </p>';
    },

    // 加载地形服务
    terrainSerivce(){
      var terrainProvider = new Cesium.CesiumTerrainProvider({
        // 设置地形服务地址
        // url: "/static/SX3_005_QMC",
        url: Cesium.IonResource.fromAssetId(1),
        // 关闭基于太阳位置地形照明、开启水面效果和隐藏不用的其他地区球体
        requestVertexNormals: false,
        // requestWaterMask: true,
        isShowGlobe: true,
      });

      // 修改viewer默认的地形服务为自己的数据源
      this.viewer.terrainProvider = terrainProvider;

      // 开启全球光照
      // this.viewer.scene.globe.enableLighting = false;
    },

    // 加载影响服务
    imageService(){

      // this.viewer.imageryLayers.addImageryProvider(
      //   new Cesium.IonImageryProvider({ assetId: 2 })
      // );


      // var arcgisProvider = new Cesium.ArcGisMapServerImageryProvider({
      //   url:
      //     "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      // });
      // imageryLayers.addImageryProvider(arcgisProvider);

      var tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
            url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer:"tiandituImg",
            style:"default",
            format:"image/jpeg",
            tileMatrixSetID:"tiandituImg",
            show:true,
            maximumLevel:18
        });
      this.viewer.imageryProvider = tdtImagerLayerProvider;

    //   var imagelayer = new Cesium.SingleTileImageryProvider({
    //     url: "http://localhost:8000/static/datasets/SX3_005_QMC.png",
    //   });
    //  this.viewer.imageryLayers.addImageryProvider(imagelayer);
    },

    // 将可达域封装到新的图层中与遥感图层叠加
    addAccessPointsLayer(){
      var layers = this.viewer.scene.imageryLayers;
      var location = this.$store.getters.getVillageLocation;
      // let rectangle = new Cesium.Rectangle.fromDegrees(105.55672645568848, 32.81075477600098, 105.60067176818848, 32.84920692443848);
      let rectangle = new Cesium.Rectangle.fromDegrees(location[0], location[1], location[2], location[3]);

      // 每次只加载一个时间段内的可达域，若加载第二个时间段则需要将之前的删除再加载新的
      if (this.accesspointsLayer == null){
        this.accesspointsLayer = layers.addImageryProvider(
          new Cesium.SingleTileImageryProvider({
            url:this.$store.getters.getAccessDomain,
            rectangle:rectangle,
          })
        );
      }
      else{
        layers.remove(this.accesspointsLayer,true);
        this.accesspointsLayer = layers.addImageryProvider(
          new Cesium.SingleTileImageryProvider({
            url:this.$store.getters.getAccessDomain,
            rectangle:rectangle,
          })
        );
      }
       

      // Change the alpha and brightness of this layer
      this.accesspointsLayer.alpha = 0.2;
      this.accesspointsLayer.brightness = 1.5;

      // Show centerpoint of the village
      var x = this.$store.getters.getCenterPoint[0];
      var y = this.$store.getters.getCenterPoint[1];
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y),
        point: {
          show: true, // default
          color: Cesium.Color['BLUE'], // default: WHITE
          pixelSize: 6, // default: 1
          outlineColor: Cesium.Color.BLACK, // default: BLACK
          outlineWidth: 1, // default: 0
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
        },
      });
      
    },

    // 跳转至村落函数
    viewerFly(){
      this.viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(this.$store.state.centerCoord[0], this.$store.state.centerCoord[1], 3000),
        duration: 4,
        orientation: {
          heading: Cesium.Math.toRadians(-10),
          pitch: Cesium.Math.toRadians(-90),
        },
      });
    },

    // 展示登临点
    showAscensionPoints(){
      const ascensionPoints = this.$store.getters.getCoords;
      // Initialize the id of each exposive point
      var idArray = new Array();
      for (var i = 0; i < ascensionPoints.length; i++){
        idArray[i] = i.toString() + '_ascension';
      }
      for (var i = 0; i < ascensionPoints.length; i++){
        var x = this.$store.getters.getCoords[i][0];
        var y = this.$store.getters.getCoords[i][1];
        this.viewer.entities.add({
          id: idArray[i],
          position: Cesium.Cartesian3.fromDegrees(x, y),
          point: {
            show: true, // default
            color: Cesium.Color['RED'], // default: WHITE
            pixelSize: 6, // default: 1
            outlineColor: Cesium.Color.BLACK, // default: BLACK
            outlineWidth: 1, // default: 0
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
          },
        });
      }

      var layers = this.viewer.scene.imageryLayers;
      var location = this.$store.getters.getVillageLocation;
      let rectangle = new Cesium.Rectangle.fromDegrees(location[0], location[1], location[2], location[3]);

      // 添加鼠标点击事件，与显示可视域相绑定
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);//获取地图对象
      var viewshedList = this.$store.getters.getViewShed;
      handler.setInputAction(()=> { //设置监听方法
          // 每次只加载一个点的可视域，若加载第二个点的则需要将之前的删除再加载新的
        if (Cesium.defined(pick) && !(idArray.indexOf(pick.id.id))){
          // Display ascension layer and hide other layers
          this.accesspointsLayer.alpha = 0,
          this.viewshedpointsLayer.alpha = 0.2;
          this.viewshedpointsLayer.brightness = 1.5;

          this.viewshedpointsLayer = layers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
              url:viewshedList[0],
              rectangle:rectangle,
            })
          );
        }
        else{
          // Display accesspointLayer and hide other layer
          this.accesspointsLayer.alpha = 0.2;
          this.exposivepointsLayer.alpha = 0;
          this.viewshedpointsLayer.alpha = 0;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      
    },
    
    // 展示暴露点
    showExposivePoints(){
      const exposivePoints = this.$store.getters.getCoords;
      // Initialize the id of each exposive point
      var idArray = new Array();
      for (var i = 0; i < exposivePoints.length; i++){
        idArray[i] = 'exposivepoint_parent_array' + i.toString();
      }
      // Add exposivepoints to entities
      for (var i = 0; i < exposivePoints.length; i++){
        var x = this.$store.getters.getCoords[i][0];
        var y = this.$store.getters.getCoords[i][1];
        this.viewer.entities.add({
          id :idArray[i],
          position: Cesium.Cartesian3.fromDegrees(x, y),
          point: {
            show: true, // default
            color: Cesium.Color['GREEN'], // default: WHITE
            pixelSize: 6, // default: 1
            outlineColor: Cesium.Color.BLACK, // default: BLACK
            outlineWidth: 1, // default: 0
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
          },
        });
      }

      var layers = this.viewer.scene.imageryLayers;
      var location = this.$store.getters.getVillageLocation;
      let rectangle = new Cesium.Rectangle.fromDegrees(location[0], location[1], location[2], location[3]);

      // Visit each point
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction((movement)=>{
        var pick = this.viewer.scene.pick(movement.position);
        //Get the id of picked point
        if (Cesium.defined(pick) && !(idArray.indexOf(pick.id.id))){
          // Display exposivepointsLayer and hide other layer
          this.accesspointsLayer.alpha = 0;
          this.exposivepointsLayer.alpha = 0.2;
          this.viewshedpointsLayer.alpha = 0;

          this.exposivepointsLayer = layers.addImageryProvider(
              new Cesium.SingleTileImageryProvider({
                url:this.$store.getters.getExposivePointResultPath + idArray.indexOf(pick.id.id) +'.png',
                rectangle:rectangle,
              })
          );
          // Change the alpha and brightness of this layer
          this.exposivepointsLayer.alpha = 0.2;
          this.exposivepointsLayer.brightness = 1.5;
        }else{
          // Display accesspointLayer and hide other layer
          this.accesspointsLayer.alpha = 0.2;
          this.exposivepointsLayer.alpha = 0;
          this.viewshedpointsLayer.alpha = 0;
        }

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    }
    
  }

};
</script>

<style>
#cesiumContainer {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>