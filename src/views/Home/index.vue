<template>
  <div>
    <van-nav-bar>
      <template #left>
        <van-image width="100" :src="require('@/assets/logo.png')" />
      </template>
      <template #right>
        <van-button round type="info" icon="search" @click="$router.push('/layout/home/searchnews')">搜索</van-button>
      </template>
    </van-nav-bar>

    <van-tabs @click="getArticleNew" v-model="activeName">
      <van-tab
        v-for="userChannel in userChannels"
        :key="userChannel.id"
        :title="userChannel.name"
        :name="userChannel.id"
      >
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="articleNew in articleNews"
              :key="articleNew.art_id"
              :title="articleNew.title"
              @click="
                () =>
                  $router.push({
                    path: '/layout/home/detail',
                    query: {
                      article_id: articleNew.art_id,
                    },
                  })
              "
            >
              <template #label>
                <div v-if="articleNew.cover.images">
                  <van-grid
                    :border="false"
                    :column-num="articleNew.cover.images.length"
                    :gutter="5"
                  >
                    <van-grid-item
                      v-for="(image, index) in articleNew.cover.images"
                      :key="index"
                    >
                      <van-image :src="image" />
                    </van-grid-item>
                  </van-grid>
                </div>
                <div>
                  <span>{{ articleNew.aut_name }}</span>
                  <span> {{ articleNew.comm_count }}评论 </span>
                  <span>{{ articleNew.pubdate | getFromNow }}</span>
                  <van-icon name="cross" />
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-icon name="wap-nav" @click="show = true" />
    </van-tabs>

    <van-action-sheet v-model="show" title="频道管理">
      <div class="adminContainer">
        <div class="userCannels">
          <div
            class="adminHeader"
            :style="{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 20px',
              height: '50px',
              alignItems: 'center',
            }"
          >
            <div :style="{ fontSize: '16px' }">我的频道</div>
            <van-button
              @click="isEdit = !isEdit"
              color="red"
              size="small"
              plain
              :style="{ width: '50px', height: '25px' }"
            >
              {{ isEdit ? "取消" : "编辑" }}
            </van-button>
          </div>
          <van-grid :column-num="4">
            <van-grid-item
              :class="{
                isActived: userChannel.id === activeName,
              }"
              v-for="userChannel in userChannels"
              :key="userChannel.id"
              :text="userChannel.name"
              @click="
                () => {
                  if (isEdit) return;
                  activeName = userChannel.id;
                  show = false;
                }
              "
            >
              <template #icon v-if="isEdit && userChannel.id">
                <van-icon
                  name="cross"
                  @click="deleteUserChannal(userChannel.id)"
                />
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="otherCannels">
          <div
            :style="{
              fontSize: '16px',
              height: '50px',
              padding: '0 20px',
              lineHeight: '50px',
            }"
          >
            可选频道
          </div>
          <van-grid :column-num="4">
            <van-grid-item
              v-for="otherChannel in otherChannels"
              :key="otherChannel.id"
              :text="otherChannel.name"
              @click="addUserChannels(otherChannel)"
            />
          </van-grid>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// import { mapActions, mapState } from "vuex";
import {
  reqGetArticleNews,
  reqGetUserChannels,
  reqGetAllChannels,
  reqSetUserChannels,
  reqDeleteUserChannels,
} from "../../api/index";
export default {
  name: "Home",
  data() {
    return {
      articleNews: [],
      loading: false,
      finished: false,
      refreshing: false,
      pre_timestamp: Date.now(),
      currentId: 0,
      show: false,
      userChannels: [],
      allChannels: [],
      isEdit: false,
      activeName: 0,
    };
  },
  computed: {
    // ...mapState(["userChannels"]),
    otherChannels() {
      return this.allChannels.filter(
        (channel) =>
          !this.userChannels.find(
            (userChannel) => userChannel.id === channel.id
          )
      );
    },
  },
  watch: {
    show() {
      this.isEdit = false;
    },
  },
  methods: {
    async onLoad() {
      let articleNewsData = await reqGetArticleNews({
        timestamp: this.pre_timestamp,
        channel_id: this.currentId,
      });
      if (this.refreshing) {
        this.articleNews = [];
      }
      this.refreshing = false;
      this.loading = false;
      this.pre_timestamp = articleNewsData.data.pre_timestamp;
      this.articleNews.push(...articleNewsData.data.results);
      if (!articleNewsData.data.pre_timestamp) {
        this.finished = true;
      }
    },
    getArticleNew(name) {
      if (this.currentId === name) return;
      this.pre_timestamp = Date.now();
      this.currentId = name;
      this.articleNews = [];
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    async addUserChannels(channel) {
      this.userChannels.push(channel);
      let newChannel = {
        id: channel.id,
        req: this.userChannels.length,
      };
      let channels = [];
      channels.push(newChannel);
      let userChannelsData = await reqSetUserChannels({ channels });
      console.log(userChannelsData);
    },
    deleteUserChannal(id) {
      console.log(id);
      reqDeleteUserChannels(id);
      this.userChannels.splice(
        this.userChannels.findIndex((userChannel) => userChannel.id === id),
        1
      );
    },
    // ...mapActions(["getUserChannel"]),
  },
  async mounted() {
    // this.getUserChannel();
    let userChannelsData = await reqGetUserChannels();
    let allChannelsData = await reqGetAllChannels();
    this.userChannels = userChannelsData.data.channels;
    this.allChannels = allChannelsData.data.channels;
  },
};
</script>

<style lang="less" scoped>
.van-button--info {
  width: 100px;
  height: 35px;
  background: rgba(255, 255, 255, 0.3);
}
.van-icon-search {
  color: #fff !important;
}
.van-tabs--line {
  width: 90%;
}
.van-icon-cross {
  right: 15px;
}
.van-icon-wap-nav {
  position: absolute;
  font-size: 22px;
  top: 11px;
  right: -30px;
  padding: 0 5px 0 10px;
}
.van-list {
  width: 100vw;
  height: calc(100vh - 140px);
  overflow: scroll;
}
.van-icon-cross {
  margin-right: 10px;
  float: right;
}
.isActived ::v-deep .van-grid-item__text {
  color: red;
}
::v-deep .van-grid-item__icon-wrapper {
  position: static;
}
.userCannels {
  ::v-deep .van-icon-cross {
    position: absolute;
    top: 4px;
    right: -7px;
    font-size: 16px;
    color: #ccc;
  }
}
</style>