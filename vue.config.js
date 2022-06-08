const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require('path')

const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
        toUrlUndefined: true
    },
      resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src'),
            'cesium': path.resolve(__dirname, cesiumSource)
        }
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
          { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify("")
      })
    ],
    module: {
      // Removes these errors: "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
      // https://github.com/AnalyticalGraphicsInc/cesium-webpack-example/issues/6
      unknownContextCritical: false,
      unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
    }
  },
  devServer:{
    proxy:{
      '/':{//代理接口前缀为/uploadFiles的请求
        target: 'http://localhost:8000',//对应的代理地址
        secure: false,
        changeOrigin: true,
        ws: false,
        pathRewrite:{
          '^/':''
        }
      },
    },
  }
};
