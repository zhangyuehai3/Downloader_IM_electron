<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-22 12:02:52
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:35:04
-->
<template>
  <div>
    <div class="title">
      <el-row>
        <el-col :span="12">EzsvsBox</el-col>
        <el-col :span="12" class="Version"
          >Version: <span>{{ Version }}</span></el-col
        >
      </el-row>
    </div>
    <el-row>
      <el-col :span="14">
        <div class="items">
          <div class="item" v-for="(item, index) in tips" :key="index">
            <el-col :span="13"> <div class="name" v-text="item.name" /></el-col>
            <el-col :span="11"
              ><div class="value" v-text="item.value"
            /></el-col>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <el-image
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList"
        >
        </el-image>
        <el-button type="primary" plain size="mini" @click.native="logout">更换账号</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { platform, release, arch } from "os";
export default {
  data() {
    return {
      Version: require("../../../../package.json").version,
        url: 'http://box-develop.oss-cn-beijing.aliyuncs.com/login/logo202101071522000.png',
        srcList: [
          'http://box-develop.oss-cn-beijing.aliyuncs.com/login/logo202101071522000.png',
        ]
    };
  },
  computed: {
    tips() {
      return [
        {
          name: this.$i18n.t("about.language"),
          value: this.$i18n.t("about.languageValue"),
        },
        {
          name: this.$i18n.t("about.currentPagePath"),
          value: this.$route.path,
        },
        {
          name: this.$i18n.t("about.currentPageName"),
          value: this.$route.name,
        },
        {
          name: this.$i18n.t("about.vueVersion"),
          value: require("vue/package.json").version,
        },
        {
          name: this.$i18n.t("about.electronVersion"),
          value: process.versions.electron || "浏览器环境",
        },
        {
          name: this.$i18n.t("about.nodeVersion"),
          value: process.versions.node || "浏览器环境",
        },
        { name: this.$i18n.t("about.systemPlatform"), value: platform() },
        { name: this.$i18n.t("about.systemVersion"), value: release() },
        { name: this.$i18n.t("about.systemArch"), value: arch() + "位" },
      ];
    },
  },
  methods:{
      logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$message({
          message: "退出成功",
          type: "success"
        });
        this.$router.push('/login')
      });
    },
  },
  mounted() {
  },
};
</script>

<style scoped lang="less">
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.Version {
  font-size: 12px;
  line-height: 30px;
  span {
    color: #35495e;
    font-weight: bold;
  }
}
.items {
  margin-top: 8px;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  line-height: 24px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
