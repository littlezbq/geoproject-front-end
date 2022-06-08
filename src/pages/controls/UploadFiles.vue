<template>
    <el-upload
      class="upload-demo"
      ref="upload"
      multiple
      action="#"
      :limit="2"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-change="handleChange"
      :http-request="selectFiles"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button class="buttonSelect" slot="trigger" size="small" type="primary"
        >选取文件</el-button
      >
      <el-button
        class="uploadButton"
        size="small"
        type="success"
        @click.once="submitUpload"
        >上传文件</el-button
      >
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>
</template>

<script>
import axios from "axios";
export default {
  name: "UploadFiles",
  data() {
    return {
      canSee:false,
      fileList: [],
      fileData: "",
      activeIndex: "2",
      loadPage: {}
    };
  },
  methods: {
    selectFiles(file) {
      this.fileData.append("files", file.file); // append增加数据
    },
    handleChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
      if (existFile) {
        this.$message.error('当前文件已经存在!');
        fileList.pop();
      }
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$store.state.imgUrls = {}
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 2 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    submitUpload() {
      if (this.fileList.length < 2) {
        this.$message({
          message: "请先选择2个文件",
          type: "warning",
        });
      } else {
        console.log("here");
        this.fileData = new FormData(); // new formData对象
        this.$refs.upload.submit(); // 提交调用uploadFile函数
        this.fileData.append("loginToken", this.loginToken); // 添加token
        this.loadPage = this.$loading({
          lock: true,
          text: "处理中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.canSee = true;
        axios
          .post("/uploadFiles", this.fileData)
          .then((response) => {
            if (response.data.result.code === 0) {
              this.$message({
                message: "上传成功",
                type: "success",
              });
              // 修改vuex中的图片路径
              this.$store.commit('modifyImageUrls',[response.data.result.dem_url,2]);
              this.$store.commit('modifyImageUrls',[response.data.result.remote_url,1]);

              // 修改跳转所用的中心,将跳转flag置于true
              this.$store.commit('modifyCenterCoord',response.data.result.centerCoord)
              if (response.data.result.dem_url !='')
                
                // 执行跳转
                this.$store.state.pageFunction()

            } else {
              this.$message({
                message: "上传失败",
                type: "error",
              });
            }
            this.loadPage.close();
            this.canSee = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style>
.uploadButton {
  margin-left: 0px;
  width: 100px;
}
.buttonSelect {
  margin-top: 0px;
  width: 100px;
}
</style>