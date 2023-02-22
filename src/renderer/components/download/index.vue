<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-21 17:09:38
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-30 11:55:21
-->
<template>
  <div>
    <el-popover
      placement="right"
      width="400"
      trigger="click"
      popper-class="popover"
    >
      <!-- <el-button
        size="mini"
        round
        @click="changeModal()"
        style="font-size: 10px; padding: 4px 10px"
        >添加下载</el-button
      > -->
      <el-button
        size="mini"
        round
        @click="handleClearDone()"
        style="font-size: 10px; padding: 4px 10px"
        >清除已完成</el-button
      >
      <div class="content">
        <v_content
          v-for="(item, key) in listItem"
          :key="key"
          :item="item"
          @handlePauseOrResume="handlePauseOrResume"
          @onOpenFolder="onOpenFolder"
          @onCancel="onCancel"
        ></v_content>
        <el-empty    class="w_wd100 w_he100" v-show="!listItem.length" description="无下载内容"></el-empty>
      </div>

      <save-price
        :modal-data="modalData"
        :show-modal="showSaveModal"
        @close-modal="closeUploadModal"
        @reload-list="reloadList"
        @getDownloadData="getDownloadData"
        v-if="showSaveModal"
      >
      </save-price>
      <el-pagination
        small
        :total="pageTatol"
        layout="total, prev, pager, next"
        :page-size="pageCount"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
       <el-tooltip slot="reference"  content="正在下载" placement="top" :value="!changeTooltip" :disabled="changeTooltip">
         <div slot="content">正<br/>在<br/>下<br/>载<br/></div>
      <el-button
        class="E-button"
        icon="el-icon-bottom"
        circle
        type="primary"
        size="mini"

      ></el-button>
      </el-tooltip>
    </el-popover>
    <el-popover
      placement="right"
      width="400"
      trigger="click"
      popper-class="popper"
    >
      <setUp></setUp>
      <el-button
        class="setUp"
        icon="el-icon-s-tools"
        circle
        size="mini"
        slot="reference"
      ></el-button>
    </el-popover>
  </div>
</template>

<script>
import SavePrice from "./modal.vue";
import main_content from "./content.vue";
import setUp from "./setUp.vue";
import {
  listenerNewDownloadItem,
  listenerDownloadItemDone,
  listenerDownloadItemUpdate,
  getDownloadData,
  pauseOrResume,
  openFileInFolder,
  removeDownloadItem,
  clearDownloadDone,
  openDownloadManager,
  getDownloadStore,
} from "./ipc-renderer";
export default {
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      showSaveModal: false,
      modalData: {},
      listItem: [],
      list: [],
      pageTatol: 1,
      pageIndex: 1,
      pageCount: 5,
      changeTooltip:true
    };
  },
  created() {
    openDownloadManager();
    this.initData();
  },
  mounted() {},
  watch: {
    "$store.state.downfileName"(newVal, oldVal) {
      this.getDownloadData();
    },
  },
  computed: {},
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.initData();
    },
    // 清空已完成
    handleClearDone() {
      let _this = this;
      this.$confirm(`确定清空已完成的下载吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const data = await clearDownloadDone();

          _this.list = data;
          _this.listItem = [...data];
          _this.initData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    changeModal() {
      this.showSaveModal = true;
    },
    onSubmit() {},
    onCancel(item, index) {
      let _this = this;
      _this
        .$confirm(
          `确定${item.state === "progressing" ? "取消并" : ""}移除下载项吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          removeDownloadItem(item, index).finally(() => {
            _this.list.splice(index, 1);
            _this.listItem = [..._this.list];
            _this.initData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    closeUploadModal: function () {
      this.showSaveModal = false;
    },
    // 更新下载数据
    handleUpdateData(item) {
      console.log(this.list, "zzzzzzzzzzzzzz");
      const index = this.list.findIndex((d) => {
        return d.id === item.id;
      });
      if (index < 0) {
        this.list.unshift(item);
      } else {
        this.list[index] = item;
      }
      this.changeTooltip =false
      this.listItem = [...this.list];
    },
    reloadList: function () {},
    async getDownloadData() {
      let _this = this;
      listenerNewDownloadItem((event, item) => {
        _this.handleUpdateData(item);
      });

      listenerDownloadItemUpdate((event, item) => {
        _this.handleUpdateData(item);
      });

      listenerDownloadItemDone((event, item) => {
        _this.handleUpdateData(item);
        _this.initData();
      });
      _this.initData();
    },
    async initData() {
      let _this = this;
      let DownloadList = await getDownloadStore();
      this.list = [];
      const data = await getDownloadData({
        pageIndex: _this.pageIndex,
        pageCount: _this.pageCount,
      });
      this.pageTatol = DownloadList.length;
      this.list.push(...data);
      this.listItem = [...data];
      this.changeTooltip =true
    },
    async handlePauseOrResume(item) {
      const data = await pauseOrResume(item);
      this.handleUpdateData(data);
    },
    // 打开文件所在目录
    async onOpenFolder(path) {
      const res = await openFileInFolder(path);

      if (!res) {
        this.$message({
          type: "info",
          message: "文件不存在",
        });
      }
    },
  },
  components: {
    "save-price": SavePrice,
    v_content: main_content,
    setUp,
  },
};
</script>
<style lang="less">
.el-popover.popper {
  background-color: #f4f5f7;
  border-color: #146ebd;
}
</style>
<style lang="less" scoped>
/deep/ .el-button.is-round {
  font-size: 10px;
  padding: 4px 10px;
}
.content {
  height: 245px;
  width: 100%;
  overflow: auto;
}
.E-button {
  -webkit-app-region: no-drag;
  position: fixed;
  left: 15px;
  bottom: 50px;
  z-index: 1002;
}
.setUp {
  -webkit-app-region: no-drag;
  position: fixed;
  left: 15px;
  bottom: 10px;
  z-index: 1002;
}
</style>
