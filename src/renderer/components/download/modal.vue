<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-14 17:27:52
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-29 15:38:43
-->
<template>
  <div class="performance_modal">
    <el-dialog
      title="下载文件"
      width="40%"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
      custom-class="Gbdialog"
      top="0vh"
    >
      <el-form :model="modalForm" :rules="modalRules" ref="modalForm">
        <el-form-item label="地址:" :label-width="formLabelWidth" prop="price">
          <el-input
            v-model.number="modalForm.url"
            auto-complete="off"
            size="small"
            disabled
            placeholder="请输入地址"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="文件名:"
          :label-width="formLabelWidth"
          prop="message"
        >
          <el-input
            v-model.number="modalForm.fileName"
            auto-complete="off"
            size="small"
            placeholder="请输入文件名"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="位置:"
          :label-width="formLabelWidth"
          prop="message"
        >
          <el-input
            v-model.number="modalForm.path"
            auto-complete="off"
            size="small"
            placeholder="请输入地址"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-date"
              @click="handleClick()"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini" round>取 消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleOk('modalForm')"
          size="mini"
          round
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  retryDownloadFile,
  getDownloadPath,
  newDownloadFile,
  openFileDialog,
  listenerNewDownloadItem,
} from "./ipc-renderer";
export default {
  name: "save_price",
  props: {
    showModal: {
      type: Boolean,
      default: true,
    },
    modalData: {
      type: Object,
      default: function () {
        return {
          url: "",
          fileName: "",
          path: "",
        };
      },
    },
  },
  data: function () {
    return {
      formLabelWidth: "80px",
      modalRules: {
        // old_price: { required: true, message: "价格不能为空", trigger: "blur" },
        // message: { required: true, message: "原因不能为空", trigger: "blur" },
      },
      submitLoading: false,
      modalForm: {
        url: "",
        fileName: "",
        path: "",
      },
    };
  },
  created: function () {
    this.modalForm = Object.assign(this.modalForm, this.modalData);
    // if(this.modalForm.price != ''){
    //     this.modalForm.old_price = this.modalForm.price
    // }
  },
  mounted(){
    this.DownloadPath()
  },
  computed: {
    showDialog: function () {
      return this.showModal;
    },
    dialogTitle: function () {
      var title =
        this.modalForm.price_type == "work_budget_price"
          ? "预算价格"
          : "结算价格";
      return (this.dialogTitle = "编辑" + title);
    },
  },
  methods: {
    handleClick: async function () {
      const newPath = await openFileDialog(this.modalData.path || "");
      console.log(newPath);
      this.modalForm.path = newPath;
    },
    handleOk: async function () {
      if (!/^(http(s?)|ftp|blob):|data:.*;base64/.test(this.modalForm.url)) {
        this.$message({
          message: "下载地址只支持 http、ftp、base64、blob 协议",
          type: "warning",
        });
        return;
      }
      const item = await newDownloadFile(this.modalForm);
      this.$emit("getDownloadData");
      this.$store.dispatch("downfileName", this.modalForm.url);
      this.closeDialog();
      if (!item) return;
      this.$confirm(`已存在${item.fileName}文件，确认覆盖？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await retryDownloadFile(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    closeDialog: function () {
      this.$emit("close-modal");
    },
    async DownloadPath(){
      console.log(getDownloadPath(),'getDownloadPath()');
      this.modalForm.path= await getDownloadPath()
    }
  },
};
</script>

<style>
.Gbdialog .dialog__header {
  padding: 5px 5px 0px !important;
}
.Gbdialog .el-dialog__title {
  font-size: 14px !important;
}
.Gbdialog .el-dialog__body {
  padding: 0px 20px;
}
.Gbdialog .el-form-item {
  margin-bottom: 0px;
}
.Gbdialog .el-form-item__label {
  font-size: 12px;
}
.Gbdialog .el-input--small .el-input__inner {
  height: 25px;
}
.Gbdialog .el-input--small{
  font-size: 12px;
}
</style>
