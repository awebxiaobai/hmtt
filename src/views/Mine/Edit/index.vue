<template>
  <div class="editContainer">
    <van-nav-bar title="编辑资料" left-arrow @click-left="onClickLeft" />
    <div class="headImg">
      <van-image round :src="userInfo.photo" />
      <van-uploader :after-read="afterRead" />
    </div>
    <van-cell
      title="名称"
      is-link
      :value="userInfo.name"
      @click="() => (showDialog = !showDialog)"
    />
    <van-cell
      title="性别"
      is-link
      :value="userInfo.gender ? '男' : '女'"
      @click="() => (showSheet = !showSheet)"
    />
    <van-cell
      title="生日"
      is-link
      :value="userInfo.birthday"
      @click="() => (showPopup = !showPopup)"
    />
    <van-dialog
      v-model="showDialog"
      title="修改名称"
      show-cancel-button
      @confirm="changeName"
    >
      <van-cell-group>
        <van-field v-model="value" />
      </van-cell-group>
    </van-dialog>
    <van-action-sheet v-model="showSheet">
      <van-nav-bar
        title="修改性别"
        left-text="取消"
        @click-left="() => (showSheet = !showSheet)"
      />
      <van-cell
        :title="userInfo.gender ? '女' : '男'"
        is-link
        @click="changeGender"
      />
    </van-action-sheet>
    <van-popup v-model="showPopup" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="changeBirthday"
        @cancel="() => (showPopup = !showPopup)"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Edit",
  data() {
    return {
      showDialog: false,
      showSheet: false,
      showPopup: false,
      value: "",
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(Date.now()),
      currentDate: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    changeName() {
      if (this.value.trim() === this.userInfo.name) return;
      this.changeProfile({ name: this.value });
    },
    changeGender() {
      console.log(+!this.userInfo.gender);
      this.changeProfile({ gender: +!this.userInfo.gender });
      this.showSheet = !this.showSheet;
    },
    changeBirthday(value) {
      // console.log(
      //   value.getFullYear() +
      //     "-" +
      //     (value.getMonth() + 1) +
      //     "-" +
      //     value.getDate()
      // );
      this.changeProfile({
        birthday:
          value.getFullYear() +
          "-" +
          (value.getMonth() + 1) +
          "-" +
          value.getDate(),
      });
      this.showPopup = !this.showPopup;
    },
    afterRead(file) {
      this.$router.push({
        path: "/layout/mine/edit/cropper",
        query: {
          imgBase64: file.content,
        },
      });
    },
    ...mapActions(["getUserInfo", "changeProfile"]),
  },
  watch: {
    showDialog() {
      this.$nextTick(() => {
        this.value = this.userInfo.name;
      });
    },
    userInfo: {
      immediate: true,
      handler() {
        if (this.userInfo.birthday) {
          this.currentDate = new Date(...[this.userInfo.birthday.split("-")]);
        }
      },
    },
  },
  mounted() {
    if (!this.userInfo.name) {
      this.getUserInfo(() => {
        this.$toast.fail("验证失败，请重新登录");
        this.$router.replace("/login");
      });
    }
  },
};
</script>

<style lang="less" scoped>
.editContainer {
  ::v-deep .van-nav-bar__arrow {
    color: #fff !important;
  }
  .headImg ::v-deep {
    position: relative;
    display: flex;
    justify-content: center;
    .van-image__img {
      // position: relative;
      // z-index: 99;
      width: 120px;
      height: 120px;
      margin: 10px 0;
    }
  }
  .van-cell-group {
    width: 80%;
    margin: auto;
    border: 1px solid #eee;
  }
  ::v-deep .van-nav-bar__text {
    color: #fff;
  }
  .van-uploader ::v-deep {
    position: absolute;
    width: 120px;
    height: 120px;
    padding: 0;
    margin: 0;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    .van-uploader__wrapper {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      border-radius: 50%;
      opacity: 0;
      .van-uploader__upload {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>