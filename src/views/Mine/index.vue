<template>
  <div>
    <div class="header">
      <van-image fit="fill" round :src="userInfo.photo" />
      <div class="userInfo">
        <div class="name">{{ userInfo.name }}</div>
        <div class="birth">
          <span>{{ userInfo.birthday }}</span>
        </div>
      </div>
    </div>
    <div class="nav">
      <van-row>
        <van-col span="8">
          <van-icon name="newspaper-o" />
          <div>我的作品</div>
        </van-col>
        <van-col span="8">
          <van-icon name="star-o" />
          <div>我的收藏</div>
        </van-col>
        <van-col span="8">
          <van-icon name="tosend" />
          <div>阅读历史</div>
        </van-col>
      </van-row>
    </div>
    <div class="content">
      <van-cell-group>
        <van-cell to="/layout/mine/edit" title="编辑资料" icon="edit" is-link />
        <van-cell title="小智同学" icon="chat-o" is-link />
        <van-cell title="系统设置" icon="setting-o" is-link />
        <van-cell title="退出登录" icon="info-o" is-link @click="logout" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Mine",
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"]),
  },

  methods: {
    logout() {
      this.$dialog
        .confirm({
          title: "确定退出吗",
        })
        .then(() => {
          this.deleteInfo(() => {
            this.$router.replace("/login");
            this.$toast.success("退出登录成功");
          });
        })
        .catch(() => {});
    },
    ...mapActions(["getUserInfo", "deleteInfo"]),
  },
  created() {
    if (!this.userInfo.name) {
      this.getUserInfo(() => {
        this.$toast.fail("验证失败，请重新登录");
        this.$router.replace("/login");
      });
    }
  },
};
</script>

<style lang='less'>
.header {
  display: flex;
  align-items: center;
  height: 120px;
  background-color: #3296fa;
  .van-image__img {
    width: 80px;
    height: 80px;
    padding: 0 10px;
  }
  .userInfo {
    font-size: 12px;
    .name {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      line-height: 32px;
    }
    .birth {
      line-height: 20px;
      color: #3296fa;
      span {
        background-color: #fff;
      }
    }
  }
}
.nav {
  .van-col {
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
    .van-icon {
      font-size: 22px;
      &-newspaper-o {
        color: #8daaff;
      }
      &-star-o {
        color: #ff1800;
      }
      &-tosend {
        color: #ffaa00;
      }
    }
    div {
      padding: 5px 0;
    }
  }
}
</style>