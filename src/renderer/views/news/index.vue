<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-27 13:56:45
-->
<template>
  <div>
    <div class="main">
      <div class="wi200">
        <div class="aside">
          <div class="search">
            <v_search></v_search>
          </div>
          <div class="content">
            <v_content></v_content>
          </div>
        </div>
      </div>
      <div class="wi100vw">
        <transition name="fade" mode="out-in">
          <router-view v-show="!changeStatus"></router-view>
        </transition>
        <el-empty 
          description="您关注的任务才是工作"
          class="w_wd100 w_he100"
          v-show="changeStatus"
        ></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import search from "./search/index.vue";
import sessionList from "./content/index.vue";
export default {
  props: {},
  data() {
    return {
      changeStatus:true
    };
  },
  created() {},
  mounted() {},
  watch: {
    $route(to, from) {
      to.path=='/news'?this.changeStatus=true:this.changeStatus=false
    },
  },
  computed: {

  },
  methods: {},
  components: {
    v_search: search,
    v_content: sessionList,
  },
};
</script>
<style lang="less" scoped>
.main {
  z-index: 102;
  display: flex;
  .wi200 {
    width: 200px;

    .aside {
      width: 100%;
      height: 100vh;
      background-color: #f4f5f7;
      color: #4d515a;
      .search {
        padding: 22px 5px 10px 5px;
        width: 100%;
        height: 60px;
        background-color: white;
      }
      .content {
        height: 90%;
      }
    }
  }
  .wi100vw {
    flex: 1;
    height: 100vh;
  }
}
</style>
