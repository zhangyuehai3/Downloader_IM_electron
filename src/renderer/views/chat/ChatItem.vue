<template>
  <li
    class="u-msg"
    :class="{
      'item-me': msg.flow === 'out',
      'item-you': msg.flow === 'in',
      'item-time': msg.type === 'timeTag',
      'item-tip': msg.type === 'tip',
      'session-chat': type === 'session',
    }"
  >
    <div v-if="msg.type === 'timeTag'" class="u-msg-time">
      {{ msg.showText }}
    </div>
    <div v-else-if="msg.type === 'tip'" class="tip">{{ msg.showText }}</div>
    <div
      v-else-if="msg.type === 'notification' && msg.scene === 'team'"
      class="notification"
    >
      {{ msg.showText }}
    </div>
    <div
      v-else-if="msg.flow === 'in' || msg.flow === 'out'"
      :idClient="msg.idClient"
      :time="msg.time"
      :flow="msg.flow"
      :type="msg.type"
    >
      <a class="msg-head" v-if="msg.avatar">
        <img class="icon u-circle" :src="msg.avatar" />
      </a>
      <p class="msg-user" v-else-if="msg.type !== 'notification'">
        <em>{{ msg.showTime }}</em
        >{{ msg.from }}
      </p>

      <span
        v-if="msg.type === 'text'"
        class="msg-text"
        v-html="msg.showText"
      ></span>
      <span
        v-else-if="msg.type === 'custom-type1'"
        class="msg-text"
        ref="mediaMsg"
      ></span>
      <span
        v-else-if="msg.type === 'custom-type3'"
        class="msg-text"
        ref="mediaMsg"
      ></span>
      <span
        v-else-if="msg.type === 'image'"
        class="msg-text"
        ref="mediaMsg"
        @click.stop="showFullImg(msg.originLink)"
      ></span>
      <span
        v-else-if="msg.type === 'video'"
        class="msg-text"
        ref="mediaMsg"
      ></span>
      <span
        v-else-if="msg.type === 'audio'"
        class="msg-text"
        @click="playAudio(msg.audioSrc)"
        >{{ msg.showText }}</span
      >
      <span v-else-if="msg.type === 'file'" class="msg-text">
        <!-- <a :href="msg.fileLink" target="_blank"
            ><i class="u-icon icon-file"></i>{{ msg.showText }}</a
          > -->

        <el-card :body-style="{ padding: '0px', display: 'flex' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
            width="50px"
          />
          <div style="padding: 5px;cursor: pointer;">
            <el-tooltip
              class="item"
              effect="dark"
              :content="msg.showText"
              placement="top"
            >
              <span class="showText">{{ msg.showText }}</span>
            </el-tooltip>
            <time class="time">{{ getFileSize(msg.file.size) }}</time>
            <div class="bottom clearfix">
              <time class="time">{{ msg.sendTime }}</time>
              <el-dropdown @command="downFile">
                <el-button size="mini" split-button type="primary" plain>
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="msg.fileLink +' '+msg.showText">下载本地</el-dropdown-item>
                  <el-dropdown-item command="a">上传云盘</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </span>
      <span v-else-if="msg.type === 'notification'" class="msg-text notify">{{
        msg.showText
      }}</span>
      <span v-else class="msg-text" v-html="msg.showText"></span>
      <span v-if="msg.status === 'fail'" class="msg-failed"
        ><i class="weui-icon-warn"></i
      ></span>
      <a
        v-if="teamMsgUnRead >= 0"
        class="msg-unread"
        :href="`#/msgReceiptDetail/${msg.to}-${msg.idServer}`"
        >{{ teamMsgUnRead > 0 ? `${teamMsgUnRead}人未读` : "全部已读" }}</a
      >
    </div>
  </li>
</template>

<script type="text/javascript">
import util from "../../utils";
import config from "../../configs";
import emojiObj from "../../configs/emoji";

export default {
  props: {
    type: String, // 类型，chatroom, session
    rawMsg: {
      type: Object,
      default() {
        return {};
      },
    },
    userInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    myInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    isRobot: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHistory: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      msg: "",
      isFullImgShow: false,
      currentAudio: null,
    };
  },
  computed: {
    robotInfos() {
      return this.$store.state.robotInfos;
    },
    teamMsgUnRead() {
      var obj =
        !this.isHistory &&
        this.msg.needMsgReceipt &&
        this.msg.flow === "out" &&
        this.$store.state.teamMsgReads.find(
          (item) => item.idServer === this.msg.idServer
        );
      return obj ? parseInt(obj.unread) : -1;
    },
  },
  beforeMount() {
    let item = Object.assign({}, this.rawMsg);
    // 标记用户，区分聊天室、普通消息
    if (this.type === "session") {
      if (item.flow === "in") {
        if (item.type === "robot" && item.content && item.content.msgOut) {
          // 机器人下行消息
          let robotAccid = item.content.robotAccid;
          item.avatar = this.robotInfos[robotAccid].avatar;
          item.isRobot = true;
          item.link = `#/mainpage/contacts/card?accid=${robotAccid}`;
        } else if (item.from !== this.$store.state.userUID) {
          item.avatar =
            (this.userInfos[item.from] && this.userInfos[item.from].avatar) ||
            config.defaultUserIcon;
          item.link = `#/mainpage/contacts/card?accid=${item.from}`;
          //  todo如果是未加好友的人发了消息，是否能看到名片
        } else {
          item.avatar = this.myInfo.avatar;
        }
      } else if (item.flow === "out") {
        item.avatar = this.myInfo.avatar;
      }
    } else {
      // 标记时间，聊天室中
      item.showTime = util.formatDate(item.time);
    }
    if (item.type === "timeTag") {
      // 标记发送的时间
      item.showText = item.text;
    } else if (item.type === "text") {
      // 文本消息
      item.showText = util.escape(item.text);
      if (/\[[^\]]+\]/.test(item.showText)) {
        let emojiItems = item.showText.match(/\[[^\]]+\]/g);
        emojiItems.forEach((text) => {
          let emojiCnt = emojiObj.emojiList.emoji;
          if (emojiCnt[text]) {
            item.showText = item.showText.replace(
              text,
              `<img class="emoji-small" src="${emojiCnt[text].img}">`
            );
          }
        });
      }
    } else if (item.type === "custom") {
      let content = JSON.parse(item.content);
      // type 1 为猜拳消息
      if (content.type === 1) {
        let data = content.data;
        let resourceUrl = config.resourceUrl;
        // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
        item.type = "custom-type1";
        item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`;
        // type 3 为贴图表情
      } else if (content.type === 3) {
        let data = content.data;
        let emojiCnt = "";
        if (emojiObj.pinupList[data.catalog]) {
          emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet];
          // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
          item.type = "custom-type3";
          item.imgUrl = `${emojiCnt.img}`;
        }
      } else {
        item.showText = util.parseCustomMsg(item);
        if (item.showText !== "[自定义消息]") {
          item.showText += ",请到手机或电脑客户端查看";
        }
      }
    } else if (item.type === "image") {
      // 原始图片全屏显示
      item.originLink = item.file.url;
    } else if (item.type === "video") {
      // ...
    } else if (item.type === "audio") {
      item.audioSrc = item.file.mp3Url;
      item.showText = Math.round(item.file.dur / 1000) + '" 点击播放';
    } else if (item.type === "file") {
      item.fileLink = item.file.url;
      item.showText = item.file.name;
      item.sendTime = util.timeStamp2String(
        Math.trunc(item.time / 1000) * 1000,
        8
      );
    } else if (item.type === "notification") {
      if (item.scene === "team") {
        item.showText = util.generateTeamSysmMsg(item);
      } else {
        //  对于系统通知，更新下用户信息的状态
        item.showText = util.generateChatroomSysMsg(item);
      }
    } else if (item.type === "tip") {
      //  对于系统通知，更新下用户信息的状态
      item.showText = item.tip;
    } else if (item.type === "robot") {
      let content = item.content || {};
      let message = content.message || [];
      if (!content.msgOut) {
        // 机器人上行消息
        item.robotFlow = "out";
        item.showText = item.text;
      } else if (content.flag === "bot") {
        item.subType = "bot";
        message = message.map((item) => {
          if (item.type === "template") {
            // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
            return item.content.json;
          } else if (item.type === "text" || item.type === "answer") {
            // 保持跟template结构一致
            return [
              {
                type: "text",
                text: item.content,
              },
            ];
          } else if (item.type === "image") {
            // 保持跟template结构一致
            return [
              {
                type: "image",
                url: item.content,
              },
            ];
          }
        });
        item.message = message;
      } else if (item.content.flag === "faq") {
        item.subType = "faq";
        item.query = message.query;
        let match = message.match.sort((a, b) => {
          // 返回最匹配的答案
          return b.score - a.score;
        });
        item.message = match[0];
      }
    } else {
      item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`;
    }
    this.msg = item;
  },
  mounted() {
    let item = this.msg;
    console.log(this.msg,'this.msgthis.msg');
    // 有时序问题的操作
    this.$nextTick(() => {
      let media = null;
      if (item.type === "image") {
        // 图片消息缩略图
        media = new Image();
        media.className = "FileImg";
        media.style = "width: 100%;";
        media.src = item.file.url + "?imageView&thumbnail=180x0&quality=85";
      } else if (item.type === "custom-type1") {
        // 猜拳消息
        media = new Image();
        media.className = "emoji-middle";
        media.src = item.imgUrl;
      } else if (item.type === "custom-type3") {
        // 贴图表情
        media = new Image();
        media.className = "emoji-big";
        media.src = item.imgUrl;
      } else if (item.type === "video") {
        if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
          media = document.createElement("video");
          media.src = item.file.url;
          media.width = 640;
          media.height = 480;
          media.autoStart = false;
          media.preload = "metadata";
          media.controls = "controls";
        } else {
          let aLink = document.createElement("a");
          aLink.href = item.file.url;
          aLink.target = "_blank";
          //  TODO aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
          this.$refs.mediaMsg.appendChild(aLink);
        }
      }
      if (media) {
        if (this.$refs.mediaMsg) {
          this.$refs.mediaMsg.appendChild(media);
        }
        media.onload = () => {
          this.$emit("msg-loaded");
        };
        media.onerror = () => {
          this.$emit("msg-loaded");
        };
      } else {
        this.$emit("msg-loaded");
      }
    }); // end this.nextTick
  },
  methods: {
    revocateMsg(vNode) {
      // 在会话聊天页
      if (this.$store.state.currSessionId) {
        if (vNode && vNode.data && vNode.data.attrs) {
          let attrs = vNode.data.attrs;
          if (attrs.type === "robot") {
            return;
          }
          // 自己发的消息
          if (attrs.flow === "out") {
            let that = this;
            this.$vux.confirm.show({
              title: "确定需要撤回消息",
              onCancel() {},
              onConfirm() {
                that.$store.dispatch("revocateMsg", {
                  idClient: attrs.idClient,
                });
              },
            });
          }
        }
      }
    },
    sendRobotBlockMsg(msg, originMsg) {
      if (this.isHistory) {
        // 在历史消息中，不进行机器人交互
        return;
      }
      let body = "[复杂按钮模板触发消息]";
      if (msg.text && msg.text.length === 1) {
        body = msg.text[0].text;
      }
      let robotAccid = originMsg.content.robotAccid;
      if (!this.isRobot) {
        body = `@${this.robotInfos[robotAccid].nick} ${body}`;
      }
      if (this.type === "session") {
        this.$store.dispatch("sendRobotMsg", {
          type: "link",
          scene: originMsg.scene,
          to: originMsg.to,
          robotAccid,
          // 机器人后台消息
          params: msg.params,
          target: msg.target,
          // 显示的文本消息
          body,
        });
      } else if (this.type === "chatroom") {
        this.$store.dispatch("sendChatroomRobotMsg", {
          type: "link",
          robotAccid,
          // 机器人后台消息
          params: msg.params,
          target: msg.target,
          // 显示的文本消息
          body,
        });
      }
    },
    continueRobotMsg(robotAccid) {
      this.$store.dispatch("continueRobotMsg", robotAccid);
    },
    showFullImg(src) {
      this.$store.dispatch("showFullscreenImg", {
        src,
      });
    },
    playAudio(src) {
      if (!this.currentAudio) {
        this.currentAudio = new Audio(src);
        this.currentAudio.play();
        this.currentAudio.onended = () => {
          this.currentAudio = null;
        };
      }
    },
    toMsgUnReadDetail() {
      this.href = "#/msgReceiptDetail/" + this.msg.idServer;
    },
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
    downFile(url){
      this.$emit('downFile', url)
    }
  },
};
</script>

<style scoped lang="less">
/deep/ .el-button--primary.is-plain {
  font-size: 10px;
  padding: 4px 10px;
}
/deep/ .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
/deep/ .el-dropdown-menu__item {
  list-style: none;
  line-height: 29px;
  padding: 0 6px;
  margin: 0;
  font-size: 10px;
  color: #606266;
  cursor: pointer;
  outline: 0;
}
.clearfix {
  // text-align: right;
}
.u-msg {
  list-style: none;
}

.u-msg .u-msg-time {
  position: relative;
  font-size: 0.8rem;
  text-align: center;
  color: #ccc;
}

.u-msg .msg-link {
  display: none;
}
.u-msg .msg-text {
  max-width: 80%;
  word-wrap: break-word;
}
.u-msg .msg-link {
  bottom: 0;
  right: -4rem;
  font-size: 0.9rem;
}

.msg-unread {
  position: relative;
  float: right;
  top: 0.3rem;
  right: 0.5rem;
  font-size: 0.9rem;
  color: #0091e4;
}

/* 消息记录 */
.u-msg {
  position: relative;

  padding: 0.2rem 0;
}
/* 用户头像 */
.u-msg .msg-head {
  position: relative;

  display: inline-block;

  top: 0.1rem;

  margin: 0;

  margin-right: 0.6rem;

  margin-left: 0.6rem;

  padding: 0;

  width: 2rem;

  height: 2rem;

  vertical-align: top;

  cursor: default;
}
.u-msg .msg-head img {
  position: relative;

  display: inline-block;

  margin: 0;

  width: inherit;

  height: inherit;
}
.u-msg .msg-user {
  font-style: italic;

  color: #999;
}
.u-msg .msg-user em {
  font-weight: normal;

  margin-right: 1rem;
}
.u-msg .msg-text {
  position: relative;

  display: inline-block;

  max-width: 54%;

  min-height: 1.2rem;

  word-break: break-word;

  height: auto;

  line-height: 1.2rem;

  font-size: 0.9rem;

  border: none;
}
.u-msg .msg-text .showText {
  display: inline-block;
  width: 150px;
  height: auto;
  display: -webkit-box;
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis; /*隐藏后添加省略号*/
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; //想显示多少行
}
.u-msg .msg-text .time{
  font-size: 10px;
}
.u-msg .msg-text .FileImg {
  position: relative;

  display: inline-block;

  margin: 0;

  padding: 0;

  max-width: 100%;
  width: 100%;
  height: 100%;

  vertical-align: bottom;
}
.u-msg .msg-text img.emoji-small {
  width: 1.4rem;

  height: 1.4rem;

  vertical-align: bottom;
}
.u-msg .msg-text img.emoji-big {
  width: 3rem;

  height: 3rem;

  vertical-align: middle;
}
.u-msg .msg-text img.emoji-big {
  width: 4.8rem;

  height: 4.8rem;

  vertical-align: middle;
}
.u-msg .msg-text embed,
.u-msg .msg-text video {
  position: relative;

  display: inline-block;

  max-width: 100%;

  max-height: 8rem;

  vertical-align: bottom;

  background-color: #000;

  text-align: center;

  color: #fff;
}
.u-msg .msg-text .button {
  margin: 0.1rem 0;

  padding: 0.1rem 0.2rem;

  border: 1px solid #fff;

  border-radius: 0.2rem;

  background-color: #e5f4ff;

  color: #666;
}
.u-msg .msg-text::before,
.u-msg .msg-text::after {
  content: " ";

  position: absolute;

  top: 12.8px;

  top: 0.8rem;

  border-top: 6.4px solid transparent;

  border-top: 0.4rem solid transparent;

  border-bottom: 6.4px solid transparent;

  border-bottom: 0.4rem solid transparent;

  width: 0;

  height: 0;
}
.u-msg .msg-text.notify {
  max-width: 100%;
}
.u-msg .msg-failed {
  position: relative;

  float: right;

  margin-right: 0.2rem;

  vertical-align: top;

  font-size: 0.92rem;

  line-height: 2rem;
}
.u-msg .msg-link {
  display: block;

  position: absolute;

  bottom: -2rem;

  right: 0;

  min-width: 4rem;

  min-height: 1.2rem;

  word-break: normal;

  height: auto;

  line-height: 1.2rem;

  font-size: 1rem;

  border: none;
}
.u-msg .msg-link a {
  color: #0091e4;

  text-decoration: underline;

  float: right;
}
.u-msg .notification {
  font-size: 0.8rem;

  text-align: center;

  color: #ccc;
}
.u-msg .notify {
  color: #f50;

  font-size: 0.8rem;
}
.u-msg.session-chat {
  padding: 0.6rem 0;

  clear: both;
}
.u-msg.session-chat .msg-text {
  padding: 0.4rem;

  margin-bottom: 0.8rem;

  border-radius: 0.4rem;
}
.u-msg.session-chat .msg-robot {
  min-width: 3rem;

  margin-bottom: 3rem;
}
.u-msg.session-chat.item-you .msg-head,
.u-msg.session-chat.item-you .msg-text {
  float: left;
}
.u-msg.session-chat.item-you .msg-text {
  background-color: #5cacde;

  color: #fff;
}
.u-msg.session-chat.item-you .msg-text::before {
  right: 99%;

  border-right: 6.4px solid #5cacde;

  border-right: 0.4rem solid #5cacde;
}
.u-msg.session-chat.item-you .msg-text::after {
  background: none;
}
.u-msg.session-chat.item-me .msg-head,
.u-msg.session-chat.item-me .msg-text {
  float: right;
}
.u-msg.session-chat.item-me .msg-text {
  color: #666;

  background-color: #e5f4ff;
}
.u-msg.session-chat.item-me .msg-text::before {
  background: none;
}
.u-msg.session-chat.item-me .msg-text::after {
  left: 99%;

  border-left: 6.4px solid #e5f4ff;

  border-left: 0.4rem solid #e5f4ff;
}
.u-msg.item-time {
  font-size: 0.8rem;

  text-align: center;

  color: #ccc;
}
.u-msg.item-tip {
  font-size: 0.8rem;

  text-align: center;
}
.u-msg.item-tip .tip {
  margin: 0 auto;

  width: 10rem;

  padding: 0.1rem;

  background-color: #e0e0e0;

  border-radius: 0.4rem;
}
</style>
