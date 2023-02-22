<template>
  <el-popover
    placement="top-start"
    width="500"
    trigger="click"
    v-model="changeShow"
     popper-class="popperOptions"
  >
    <div class="m-chat-emoji">
      <div class="emoji-content">
        <div class="cnt">
          <span
            class="emoji-item"
            :class="{ 'pinup-item': item.type === 'pinup' }"
            v-for="item in currEmoji.list"
            @click.stop="selectEmoji(item)"
            :key="item.img"
          >
            <img :src="item.img" />
          </span>
        </div>
      </div>
      <div class="emoji-channel">
        <span
          class="emoji-album"
          :class="{ active: item.name == currAlbum }"
          v-for="item in emoji"
          @click.stop="selectAlbum(item)"
          :key="item.album"
        >
          <img :src="item.album" />
        </span>
        <span
          v-if="type === 'session'"
          class="emoji-album"
          :class="{ active: item.name == currAlbum }"
          v-for="item in pinup"
          @click.stop="selectAlbum(item)"
          :key="item.album"
        >
          <img :src="item.album" />
        </span>
      </div>
    </div>
    <i class="u-icon-img" slot="reference"><img width="20px" :src="icon1" /></i>
  </el-popover>
</template>

<script>
import emojiObj from "../../configs/emoji";
import config from "../../configs";
function genEmojiList(type, emojiList) {
  let result = {};
  for (let name in emojiList) {
    let emojiMap = emojiList[name];
    let list = [];
    for (let key in emojiMap) {
      list.push({
        type,
        name,
        key,
        img: emojiMap[key].img,
      });
    }
    if (list.length > 0) {
      result[name] = {
        type,
        name,
        list,
        album: list[0].img,
      };
    }
  }
  return result;
}

export default {
  name: "chat-emoji",
  props: {
    type: String,
    scene: String,
    to: String,
    show: Boolean,
  },
  data() {
    return {
      icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
      currType: "emoji",
      currAlbum: "emoji",
    };
  },
  computed: {
    changeShow: {
      get() {
        return this.show;
      },
      set(v) {},
    },
    emoji() {
      return genEmojiList("emoji", emojiObj.emojiList);
    },
    pinup() {
      return genEmojiList("pinup", emojiObj.pinupList);
    },
    currEmoji() {
      if (this.currType === "emoji") {
        return this.emoji[this.currAlbum];
      } else if (this.currType === "pinup") {
        return this.pinup[this.currAlbum];
      }
      return [];
    },
  },
  methods: {
    selectAlbum(album) {
      this.currType = album.type;
      this.currAlbum = album.name;
    },
    selectEmoji(emoji) {
      if (this.currType === "emoji") {
        // 由触发父组件事件，增加表情文案
        this.$emit("add-emoji", emoji.key);
      } else if (this.currType === "pinup") {
        if (this.type === "session") {
          this.$store.dispatch("sendMsg", {
            type: "custom",
            scene: this.scene,
            to: this.to,
            pushContent: "[贴图表情]",
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key,
              },
            },
          });
        } else if (this.type === "chatroom") {
          this.$store.dispatch("sendChatroomMsg", {
            type: "custom",
            pushContent: "[贴图表情]",
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key,
              },
            },
          });
        }
        this.$emit("hide-emoji");
      }
    },
  },
};
</script>
<style >
.popperOptions{
    padding: 0px;
}
</style>

<style type="text/css" scoped lang="less">
.m-chat-emoji {
  /* position: absolute;
  bottom: 25%;
  height: 12rem;
  width: 500px; */
  border: 1px solid #ccc;
  background-color: #fff;
}

.m-chat-emoji .emoji-channel {
  position: relative;
  width: 100%;
  height: auto;
}
.m-chat-emoji .emoji-channel .emoji-album {
  display: inline-block;
  padding: 0.1rem;
  width: 1.8rem;
  height: 1.8rem;
  border-right: 1px solid #f0f0f0;
  
    cursor: pointer;

}

.m-chat-emoji .emoji-channel .emoji-album img {
  margin: 0;
  display: block;
  width: inherit;
  height: inherit;
}

.m-chat-emoji .emoji-channel .emoji-album img .active {
  background-color: #f0f0f0;
}

.emoji-content {
  position: relative;
  width: 100%;
  height: 10rem;
  background-color: #f0f0f0;
  overflow-y: auto;
}

.emoji-content .cnt {
  position: relative;
  display: block;
  margin: 0.4rem auto;
  text-align: left;
  width: 100%;
  height: 100%;
}
.emoji-content .emoji-item {
  display: inline-block;
  width: 28px;
  height: 28px;
  padding: 2px;
  vertical-align: middle;
      cursor: pointer;
  /*border: 1px solid #fff;*/
  /*margin-left: -1px;*/
  /*margin-bottom: -1px;*/
}

.emoji-content .emoji-item img {
  width: inherit;
  height: inherit;
}
.pinup-item {
  width: 44px;
  height: 44px;
}
</style>
