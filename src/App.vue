<template>
  <div>
    <DisplayMain/>
  </div>
</template>

<script>
import DisplayMain from './pages/DisplayMain.vue'

export default {
  name: 'app',
  components: {
    DisplayMain
  }
}
</script>

<style>
/* 调整整体页边距 */
*{
  margin: 0;
  padding: 0;
}
</style>
