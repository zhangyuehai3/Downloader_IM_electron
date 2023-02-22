<template>
  <div class="m-main-list">
    <!--<router-link :to="{name:'sysmsgs'}">
            <div class="u-list-item">
                <img class="icon" slot="icon" width="24" :src="myPhoneIcon">
                我的手机
            </div>
        </router-link>-->
    <el-card
      shadow="hover"
      :body-style="{ padding: '10px', display: 'flex', cursor: 'pointer' }"
    >
      <!-- <router-link :to="{ name: 'sysmsgs' }"> -->
      <img class="noticeIcon" :src="myPhoneIcon" />
      <div class="single-content">我的手机</div>
      <!-- <span v-show="sysMsgUnread > 0" class="u-unread">{{
            sysMsgUnread
          }}</span> -->
      <!-- </router-link> -->
    </el-card>
    <el-card
      shadow="hover"
      :body-style="{ padding: '10px', display: 'flex', cursor: 'pointer' }"
    >
      <!-- <router-link :to="{ name: 'sysmsgs' }"> -->
      <img class="noticeIcon" :src="noticeIcon" />
      <div class="single-content">消息中心</div>
      <!-- <span v-show="sysMsgUnread > 0" class="u-unread">{{
            sysMsgUnread
          }}</span> -->
      <!-- </router-link> -->
    </el-card>
    <el-collapse-transition>
      <div v-show="transitionShow">
        <el-card
          shadow="hover"
          @click.native="pushURL(session)"
          :body-style="{
            padding: '10px',
            display: 'flex',
            height: '45px',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding:'0px'
          }"
          v-for="session in sessionlist"
          :key="session.id"
          :id="session.id"
        >
          <VueContextMenu
            :contextMenuData="sessionMenuData"
            @delete="deleteSession"
          />
          <!-- <router-link
        :to="{
          name: 'chat',
          query: { sessionId: session.id, firstFlag: true },
        }"
      > -->
          <div class="w_flex" style="width: 100%;padding: 10px;"   @contextmenu.prevent="showMenu" :id="session.id">
            <el-badge
              :hidden="!session.unread"
              :value="session.unread"
              :max="99"
              class="item"
            >
              <el-image
                class="icon"
                :src="session.avatar"
                :preview-src-list="session.avatarAR"
              >
              </el-image>
            </el-badge>
            <div class="multi-content">
              <div class="title">{{ session.name }}</div>
              <div class="content">{{ session.lastMsgShow }}</div>
            </div>
            <el-tag type="success" size="mini" effect="dark">
              {{ session.updateTimeShow }}</el-tag
            >
          </div>

          <!-- <div style="margin-left: 0.6rem; display: list-item">
        <div
          style="
            color: #ccc;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.8rem;
          "
        >
          {{ session.updateTimeShow }}
        </div>
        <span v-show="session.unread > 0" class="u-unread">{{
          session.unread
        }}</span>
      </div> -->
          <!-- </router-link> -->
        </el-card>
      </div>
    </el-collapse-transition>
    <!-- <ul class="u-list" id="nsession-list"> -->
    <!-- <li
        class="u-list-item"
        id="msgCenter"
        @click="activeId = 'msgCenter'"
        :class="'msgCenter' === activeId ? 'u-list-item-active' : ''"
      >
        <router-link :to="{ name: 'sysmsgs' }">
          <div class="u-list-item-container">
            <img class="icon" :src="noticeIcon" />
            <div class="single-content">消息中心</div>
            <span v-show="sysMsgUnread > 0" class="u-unread">{{
              sysMsgUnread
            }}</span>
          </div>
        </router-link>
      </li> -->
    <!-- <li
        class="u-list-item"
        @contextmenu="showMenu"
        @click="activeId = session.id"
        :class="session.id === activeId ? 'u-list-item-active' : ''"
        v-for="session in sessionlist"
        :key="session.id"
        :id="session.id"
      >
        <VueContextMenu
          :contextMenuData="sessionMenuData"
          @delete="deleteSession"
        />
        <router-link
          :to="{
            name: 'chat',
            query: { sessionId: session.id, firstFlag: true },
          }"
        >
          <div class="u-list-item-container">
            <img class="icon" :src="session.avatar" />
            <div class="multi-content">
              <div class="title">{{ session.name }}</div>
              <div class="content">{{ session.lastMsgShow }}</div>
            </div>
            <div style="margin-left: 0.6rem; display: list-item">
              <div
                style="
                  color: #ccc;
                  overflow: hidden;
                  white-space: nowrap;
                  font-size: 0.8rem;
                "
              >
                {{ session.updateTimeShow }}
              </div>
              <span v-show="session.unread > 0" class="u-unread">{{
                session.unread
              }}</span>
            </div>
          </div>
        </router-link>
      </li>
    </ul> -->
  </div>
</template>

<script>
import util from "@/utils";
import config from "@/configs";
import { setTimeout } from "timers";
import pageUtil from "@/utils/page";
export default {
  name: "session-list",
  mounted() {
    var _this = this;
    this.eventBus.$on("locationMainListItem", function (data) {
      if (data.listType === "session") {
        setTimeout(() => {
          pageUtil.scrollMainList("nsession-list", data.activeId);
          _this.activeId = data.activeId;
        }, 500);
      }
    });
  },
  data() {
    return {
      transitionShow: false,
      activeId: "",
      delSessionId: null,
      stopBubble: false,
      noticeIcon: config.noticeIcon,
      myPhoneIcon: config.myPhoneIcon,
      myGroupIcon: config.defaultGroupIcon,
      myAdvancedIcon: config.defaultAdvancedIcon,
      menuId: "",
      sessionMenuData: {
        menuName: "sessionMenu",
        axis: { x: null, y: null },
        menulists: [{ fnHandler: "delete", btnName: "删除会话" }],
      },
    };
  },
  computed: {
    sysMsgUnread() {
      let temp = this.$store.state.sysMsgUnread;
      let sysMsgUnread = temp.addFriend || 0;
      sysMsgUnread += temp.team || 0;
      let customSysMsgUnread = this.$store.state.customSysMsgUnread;
      let total = sysMsgUnread + customSysMsgUnread;
      return total > 99 ? 99 : total;
    },
    userInfos() {
      return this.$store.state.userInfos;
    },
    myInfo() {
      console.log();
      return this.$store.state.myInfo;
    },
    myPhoneId() {
      return `${this.$store.state.userUID}`;
    },
    sessionlist() {
      let _this = this;
      _this.transitionShow = false;
      let sessionlist = this.$store.state.sessionlist.filter((item) => {
        item.name = "";
        item.avatar = "";
        if (item.scene === "p2p") {
          let userInfo = null;
          if (item.to !== this.myPhoneId) {
            userInfo = this.userInfos[item.to];
          } else {
            // userInfo = this.myInfo
            // userInfo.alias = '我的手机'
            // userInfo.avatar = `${config.myPhoneIcon}`
            return false;
          }
          if (userInfo) {
            item.name = util.getFriendAlias(userInfo);
            item.avatar = userInfo.avatar;
          }
        } else if (item.scene === "team") {
          let teamInfo = null;
          teamInfo = this.$store.state.teamlist.find((team) => {
            return team.teamId === item.to;
          });
          if (teamInfo) {
            item.name = teamInfo.name;
            item.avatar =
              teamInfo.avatar ||
              (teamInfo.type === "normal"
                ? this.myGroupIcon
                : this.myAdvancedIcon);
          } else {
            item.name = `群${item.to}`;
            item.avatar = item.avatar || this.myGroupIcon;
          }
        }
        let lastMsg = item.lastMsg || {};
        if (lastMsg.type === "text") {
          item.lastMsgShow = lastMsg.text || "";
        } else if (lastMsg.type === "custom") {
          item.lastMsgShow = util.parseCustomMsg(lastMsg);
        } else if (
          lastMsg.scene === "team" &&
          lastMsg.type === "notification"
        ) {
          item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
        } else if (util.mapMsgType(lastMsg)) {
          item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
        } else {
          item.lastMsgShow = "";
        }
        if (item.updateTime) {
          item.updateTimeShow = util.formatDate(item.updateTime, true);
        }
        if (item.unread > 99) item.unread = 99;
        item.avatarAR = [item.avatar];
        return item;
      });
      setTimeout(() => {
        _this.transitionShow = true;
      });
      return sessionlist;
    },
  },
  methods: {
    pushURL(session) {
      this.$router.push({
        name: "chat",
        query: { sessionId: session.id, firstFlag: true },
      });
    },
    enterMyChat() {
      // 我的手机页面
      location.href = `#/chat/p2p-${this.myPhoneId}`;
    },
    showMenu(parameter) {
      parameter.preventDefault();
      var x = parameter.clientX;
      var y = parameter.clientY;
      this.menuId = parameter.currentTarget.id;
      this.sessionMenuData.axis  = {
        x,
        y,
      };
    },
    deleteSession() {
      if (this.menuId) {
        this.$store.dispatch("deleteSession", this.menuId);
      }
    },
  },
  created() {
    console.log(this.$store.state.sessionlist, "sessionlist");
  },
};
</script>

<style>
.no-child-btn{
  padding: 2px 10px !important;
}
.context-menu-list:hover{
  background-color: rgb(240,248,255) !important;
      color: cornflowerblue !important;
}
.context-menu-list{
  color: #9d9d9d !important;
  font-size: 10px !important;
}
/*时间提示*/
.g-window .u-session-time {
  display: inline-block;
  position: relative;
  right: 1.8rem;
  top: 1.1rem;
}
/* 未读数标签 */
.g-window .u-unread {
  display: block;
  margin: 0 auto;
  padding: 2px;
  min-width: 1rem;
  width: 1rem;
  min-height: 1rem;
  line-height: 1rem;
  font-size: 12px;
  background-color: #f00;
  color: #fff;
  text-align: center;
  border-radius: 50%;
}
</style>
<style scoped lang="less">
/deep/ .el-badge__content {
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 10px;
  height: 15px;
  line-height: 14px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
/deep/ .el-tag--mini {
  font-size: 10px;
  height: 20px;
  padding: 0 5px;
  line-height: 19px;
  margin-top: 10px;
}
.m-main-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  .u-list {
    height: 100%;
  }
  .noticeIcon {
    width: 25px;
  }
  .single-content {
    font-size: 12px;
    line-height: 25px;
    color: #9d9d9d;
    margin-left: 5px;
  }
  .icon {
    width: 25px;
  }
  .title {
    font-size: 12px;
    margin-left: 5px;
  }
  .content {
    font-size: 10px;
    margin-left: 5px;
    color: cadetblue;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
