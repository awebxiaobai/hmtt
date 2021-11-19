<template>
  <div class="detailContainer">
    <van-nav-bar
      title="文章详细"
      left-arrow
      @click-left="() => this.$router.back()"
    />
    <div class="contentContainer">
      <h2>{{ newsDetail.title }}</h2>
      <div class="autInfo">
        <van-image
          round
          fit="cover"
          width="40px"
          height="40px"
          :src="newsDetail.aut_photo"
        />
        <div class="info">
          <div>{{ newsDetail.aut_name }}</div>
          <div class="time">{{ newsDetail.pubdate | getFromNow }}</div>
        </div>
        <van-button round type="info" icon="plus">关注</van-button>
      </div>
      <div v-html="newsDetail.content" class="content"></div>
    </div>
    <div class="end">
      <div></div>
      <span>end</span>
      <div></div>
    </div>
    <div class="btns">
      <van-button round plain icon="good-job-o" type="primary">点赞</van-button>
      <van-button round plain icon="delete" type="danger">不喜欢</van-button>
    </div>

    <div :style="{ marginBottom: '52px' }">
      <div
        v-if="!comments.length"
        :style="{ textAlign: 'center', padding: '20px' }"
      >
        没有更多了
      </div>
      <div
        v-else
        class="commentContainer"
        v-for="comment in comments"
        :key="comment.com_id"
      >
        <van-image round width="40px" height="40px" :src="comment.aut_photo" />
        <div class="commentInfo">
          <div class="name">{{ comment.aut_name }}</div>
          <div>{{ comment.content }}</div>
          <div class="time">
            {{ comment.pubdate | getFromNow }}
            <van-button
              color="#eee"
              size="small"
              plain
              @click="toReply(comment)"
              >回复({{comment.reply_count}})</van-button
            >
          </div>
        </div>
        <van-icon name="like-o" />
      </div>
    </div>

    <!-- 评论 -->
    <div
      class="comment"
      :style="{ position: 'fixed', bottom: '0', width: '100%' }"
    >
      <van-field
        center
        clearable
        placeholder="友好的评论"
        v-model="value"
        @keydown.enter="toAddComment"
      >
        <template #button>
          <van-button size="small" type="info" @click="toAddComment"
            >发布</van-button
          >
        </template>
      </van-field>
    </div>

    <!-- 回复评论模块 -->
    <van-action-sheet v-model="show" title="发表回复">
      <div :style="{ marginBottom: '52px' }">
        <div class="commentContainer">
          <van-image
            round
            width="40px"
            height="40px"
            :src="curComment.aut_photo"
          />
          <div class="commentInfo">
            <div class="name">{{ curComment.aut_name }}</div>
            <div>{{ curComment.content }}</div>
            <div class="time">
              {{ curComment.pubdate | getFromNow }}
            </div>
          </div>
          <van-icon name="like-o" />
        </div>
        <div class="end">
          <div></div>
          <span>全部回复</span>
          <div></div>
        </div>
        <div
          class="commentContainer"
          v-for="(replyComment, index) in replyComments"
          :key="index"
        >
          <van-image
            round
            width="40px"
            height="40px"
            :src="replyComment.aut_photo"
          />
          <div class="commentInfo">
            <div class="name">{{ replyComment.aut_name }}</div>
            <div>{{ replyComment.content }}</div>
            <div class="time">
              {{ replyComment.pubdate | getFromNow }}
            </div>
          </div>
          <van-icon name="like-o" />
        </div>
      </div>
      <div
        class="comment"
        :style="{ position: 'fixed', bottom: '0', width: '100%' }"
      >
        <van-field
          center
          clearable
          placeholder="友好的评论"
          v-model="valueReply"
          @keydown.enter="toAddReplyComment"
        >
          <template #button>
            <van-button size="small" type="info" @click="toAddReplyComment"
              >发布</van-button
            >
          </template>
        </van-field>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import {
  reqGetNewsDetail,
  reqGetCommentOrBack,
  reqAddComments,
} from "../../../api/index";
export default {
  name: "Detail",
  data() {
    return {
      newsDetail: {},
      comments: [],
      value: "",
      show: false,
      curComment: {},
      replyComments: [],
      valueReply: "",
    };
  },
  methods: {
    async toAddComment() {
      let { article_id } = this.$route.query;
      if (!this.value.trim()) return;
      let addCommentsData = await reqAddComments({
        target: article_id,
        content: this.value,
      });
      this.value = "";
      this.comments.unshift(addCommentsData.data.new_obj);
    },
    async toReply(comment) {
      this.show = true;
      this.curComment = comment;
      let replyCommentsData = await reqGetCommentOrBack({
        type: "c",
        source: comment.com_id,
      });
      this.replyComments = replyCommentsData.data.results;
    },
    async toAddReplyComment() {
      let { article_id } = this.$route.query;
      if (!this.valueReply.trim()) return;
      let addReplyCommentsData = await reqAddComments({
        target: this.curComment.com_id,
        content: this.valueReply,
        art_id: article_id,
      });
      this.curComment.reply_count++
      this.valueReply = "";
      this.replyComments.unshift(addReplyCommentsData.data.new_obj);
    },
  },
  async mounted() {
    let { article_id } = this.$route.query;
    let newsDetailData = await reqGetNewsDetail({ article_id });
    let commentsData = await reqGetCommentOrBack({
      type: "a",
      source: article_id,
    });
    this.newsDetail = newsDetailData.data;
    this.comments = commentsData.data.results;
  },
};
</script>

<style scoped lang="less">
.detailContainer {
  ::v-deep .van-nav-bar__arrow {
    color: #fff !important;
  }

  .contentContainer {
    padding: 0 10px;
    h2 {
      font-size: 22px;
      line-height: 44px;
    }
    .autInfo {
      display: flex;
      margin: 10px 0;
      align-items: center;
      .info {
        flex: 1;
        font-size: 14px;
        padding: 0 10px;
        .time {
          color: #999;
        }
      }
    }
    .content ::v-deep {
      word-wrap: break-word;
      overflow: hidden;
      // white-space: pre;
      pre {
        background: chartreuse;
        overflow: auto;
      }
    }
  }
  .end {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding: 10px 0;
    div {
      height: 1px;
      flex: 1;
      background: #ddd;
    }
    span {
      color: #999;
    }
  }
  .btns {
    display: flex;
    padding: 0 50px;
    justify-content: space-around;
  }
  .commentContainer {
    display: flex;
    margin: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    // text-align: center;
    .commentInfo {
      flex: 1;
      padding: 5px 10px;
      .name {
        color: darkorange;
      }
      .time {
        display: flex;
        align-items: center;
      }
    }

    .van-button--small {
      height: 25px;
      line-height: 25px;
      // padding: 0;
      color: #000 !important;
    }
  }
}
</style>