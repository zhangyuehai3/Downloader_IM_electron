<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:24:34
-->
<template>
  <div
    class="app-wrapper"
    :class="IsUseSysTitle ? 'UseSysTitle' : 'NoUseSysTitle'"
  >
    <div :class="classObj">
      <!-- <navbar></navbar> -->
      <div class="container-set">
        <c-header></c-header>

        <sidebar
          style="-webkit-app-region: drag; -webkit-user-select: none"
          class="sidebar-container"
          :class="IsUseSysTitle ? 'UseSysTitle' : 'NoUseSysTitle'"
        ></sidebar>

        <div class="main-container">
          <app-main></app-main>
        </div>
        <Cdownload></Cdownload>
      </div>
    </div>
  </div>
</template>

<script>
import CHeader from "@/components/title";
import Cdownload from "@/components/download";
import { Sidebar, AppMain, Navbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    Sidebar,
    AppMain,
    Navbar,
    Cdownload,
    CHeader,
  },
  mixins: [ResizeMixin],
  data: () => ({
    IsUseSysTitle: require("./../../../config").IsUseSysTitle,
  }),
  computed: {
    sidebar() {
      return this.$store.state.sidebar;
    },
    device() {
      return this.$store.state.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .container-set {
    position: relative;
    // padding-top: 62px;
  }
}
.UseSysTitle {
  top: 0px;
}
.NoUseSysTitle {
  // top:30px
}
</style>
