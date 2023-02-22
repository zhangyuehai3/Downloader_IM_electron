<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-16 10:36:57
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-28 16:42:37
-->
<template>
    <div class="download-item-container">
      <!-- {/* 下载进度 */} -->

      <div
        v-if="item.state === 'progressing'"
        class="download-item-progress"
        style=""
      />
      <div class="download-item-main">
        <!-- {/* 下载项的图标 */} -->
        <div class="file-icon">
          <img :src="item.icon" />
        </div>
        <!-- {/* 文件名、下载大小、速度 */} -->
        <div class="file-info">
          <p class="file-name">{{ item.fileName }}</p>
          <div class="file-desc">
            <div v-if="item.state === 'progressing'">
              <div class="file-size">
                {{ this.getFileSize(item.receivedBytes, false) }}/{{
                  this.getFileSize(item.totalBytes)
                }}
              </div>
              <span class="download-speed"
                >{{ getFileSize(item.speed) }}/s</span
              >
            </div>
            <p v-if="item.state === 'completed'">
              {{ this.getFileSize(item.totalBytes) }}
            </p>
          </div>
        </div>
        <!-- {/* 操作 */} -->
        <div class="operating">
          <!-- <el-button
            v-if="item.state === 'progressing'"
            size="mini"
            round
            @click="handlePauseOrResume(item)"
            >{{ item.paused ? "恢复" : "暂停" }}</el-button
          > -->
          <el-button
            v-if="item.state === 'completed'"
            size="mini"
            round
            @click="onOpenFolder(item.path)"
            >打开所在位置</el-button
          >
          <el-button size="mini" round @click="onCancel(item,keyCode)">{{
            (item.state === "progressing" ? "取消并" : "") + "移除下载"
          }}</el-button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "main_content",
  props: {
    item: {
      type: Object,
      default: {},
    },
    keyCode: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    getFileSize(bytes, isUnit) {
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      isUnit = isUnit ?? true;

      if (bytes === 0) {
        return isUnit ? "0B" : "0";
      }

      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) {
        return bytes + (isUnit ? sizes[i] : "");
      }
      return (bytes / 1024 ** i).toFixed(2) + (isUnit ? sizes[i] : "");
    },
    handlePauseOrResume(item) {
      this.$emit("handlePauseOrResume", item);
    },
    onOpenFolder(item) {
      this.$emit("onOpenFolder", item);
    },
    onCancel(item,key){
        this.$emit("onCancel", item,key);
    }
  },
  components: {},
};
</script>
<style lang="less" scoped>
/deep/ .el-button{
  font-size: 10px;
  padding: 4px 10px;
}
.menu-container {
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
}

.download-item-container {
  padding: 10px 15px;
  position: relative;
  -webkit-app-region: no-drag;
    border-bottom: 1px solid #eee;
  .download-item-progress {
    background-color: #e6f7ff;
    position: absolute;
    left: 0;
    top: 0;
    max-width: 100%;
    height: 100%;
    transition: width linear 0.3s;
  }

  .download-item-main {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .file-icon {
    width: 25px;
    height: 25px;
    img{
      width: 25px;
    }
  }

  .file-info {
    flex: 1;
    padding: 0 10px;
    overflow: hidden;

    p {
      margin: 0;
      font-size: 10px;
    }
  }

  .file-name {
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .file-desc {
    color: #999;
    display: flex;
    font-size: 12px;

    .file-size {
      flex: 1;
    }

    .download-speed {
      flex: 1;
    }
  }

  .operating {
    .operating-item {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>
