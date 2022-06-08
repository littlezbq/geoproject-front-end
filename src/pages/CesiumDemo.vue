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
      this.viewer = new Cesium.Viewer("cesiumContainer");

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

    // Upload accesspoints to viewer
    showAccessPoints(){
      // Declare the point render collection
      var pointPrimitives = null;
      pointPrimitives = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
      // Catch accesspoints corrds from vuex
      const accesspoints = this.$store.getters.getCoords;
      
      for(var i = 0; i < accesspoints.length; i++){
        var position = Cesium.Cartesian3.fromDegrees(accesspoints[i][0][0],accesspoints[i][0][1],accesspoints[i][1])
        pointPrimitives.add({
          pixelSize: 6,
          color: Cesium.Color['BLUE'],
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          position: position,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND ,
        })
      }
      
    },

    // 展示登临点
    showAscensionPoints(){
      const ascensionPoints = this.$store.getters.getCoords;
      for (var i = 0; i < ascensionPoints.length; i++){
        var x = this.$store.getters.getCoords[i][0];
        var y = this.$store.getters.getCoords[i][1];
        this.viewer.entities.add({
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
        if (this.viewshedpointsLayer == null){
          layers.remove(this.accesspointsLayer,true);
          this.viewshedpointsLayer = layers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
              url:viewshedList[0],
              rectangle:rectangle,
            })
          );
        }
        else{
          layers.remove(this.viewshedpointsLayer,true);
          this.viewshedpointsLayer = layers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
              url:this.$store.getters.getViewShed,
              rectangle:rectangle,
            })
          );
        }
        
      
        // Change the alpha and brightness of this layer
        this.viewshedpointsLayer.alpha = 0.2;
        this.viewshedpointsLayer.brightness = 1.5;

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      
    },
    
    // 展示暴露点
    showExposivePoints(){
      const exposivePoints = this.$store.getters.getCoords;
      for (var i = 0; i < exposivePoints.length; i++){
        var x = this.$store.getters.getCoords[i][0];
        var y = this.$store.getters.getCoords[i][1];
        this.viewer.entities.add({
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