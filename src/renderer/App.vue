<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-29 15:56:13
-->
<template>
  <div id="app">
    <!-- <c-header></c-header> -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import CHeader from "./components/title";
export default {
  components: { CHeader },
      updated () {
      // 提交sdk连接请求
      this.$store.dispatch('connect')
      this.$store.dispatch('updateRefreshState')
    },
};
</script>

<style>
.dialog-fade-enter-active .el-dialog.transactionData{
    animation: anim-open .3s ease !important;
    -webkit-animation: anim-open .3s ease !important;
}

.dialog-fade-leave-active .el-dialog.transactionData{
    animation: anim-close .3s ease !important;
    -webkit-animation: anim-close .3s ease !important;
}

@keyframes anim-open{
     0%{
        transform: scale(0);
        -webkit-transform: scale(0);
        -moz-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
}
    100%{
        transform: scale(1);
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
}
}
@keyframes anim-close{
    0%{
       transform: scale(1);
       -webkit-transform: scale(1);
       -moz-transform: scale(1);
       -ms-transform: scale(1);
       -o-transform: scale(1);
}
   100%{
       transform: scale(0);
       -webkit-transform: scale(0);
       -moz-transform: scale(0);
       -ms-transform: scale(0);
       -o-transform: scale(0);
}
}
</style>
