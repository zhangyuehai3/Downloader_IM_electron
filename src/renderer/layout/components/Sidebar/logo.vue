<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 15:39:59
-->
<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <el-image
          style="width: 100%; height: 100%;padding: 4px;border-radius: 28px;"
          :src="url"
          :preview-src-list="srcList"
        >
        </el-image>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "logo名称",
      url: "https://nim-nosdn.netease.im/MjE4NzYxOTE=/bmltYV8zMzc4MTk0OTM4MV8xNjQ2ODI0ODczMTQwX2IyY2MzZTFjLTcxMDMtNDFhOC05Y2Q4LTg3YWE3MWVlZjAwMg==?imageView&thumbnail=80x80&quality=85",
      srcList: [
        "https://nim-nosdn.netease.im/MjE4NzYxOTE=/bmltYV8zMzc4MTk0OTM4MV8xNjQ2ODI0ODczMTQwX2IyY2MzZTFjLTcxMDMtNDFhOC05Y2Q4LTg3YWE3MWVlZjAwMg==?imageView&thumbnail=80x80&quality=85",
      ],
    };
  },
  mounted(){
  console.log(this.$store.state.myInfo,11111111111);
  },
  computed: {
    myInfo () {
       
      return this.$store.state.myInfo
    }
  }
  
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 0.28s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  -webkit-app-region: no-drag;
  border: none;
  box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 12px 5px -10px rgba(0, 0, 0, 0.1),
    0 0 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
  width: 100%;
  height: 61px;
  line-height: 61px;
  text-align: center;
  overflow: hidden;
  background-color: aliceblue;

  & > .sidebar-logo-link {
    height: 100%;
    width: 100%;
        .sidebar
    & > .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & > .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #333;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
.collapse {
  .sidebar-logo {
    margin-right: 0px !important;
    margin-left: 0px !important;
  }
}
</style>
