<template>
    <div>
        <HomeHeader/>
        <router-view/>
        <HomeFooter/>
    </div>
  
</template>

<script>
// import AutoSortingPage from './AutoSortingPage.vue'
import HomeHeader from '../components/HomeHeader.vue'
import HomeFooter from '../components/HomeFooter.vue'
export default {
    name:'DisplayMain',
    components:{
        // AutoSortingPage,
        HomeHeader,
        HomeFooter
    }
}
</script>

<style>

</style>