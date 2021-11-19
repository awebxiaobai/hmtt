<template>
  <div style="height: 100vh">
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="() => this.$router.back()"
    />
    <vue-cropper
      autoCrop
      :img="$route.query.imgBase64"
      ref="cropper"
      centerBox
    />
    <van-button type="info" @click="toChangePhoto">确认</van-button>
    <van-button type="info" @click="this.$router.back()">取消</van-button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    toChangePhoto() {
      this.$refs.cropper.getCropBlob((data) => {
        const file = new FormData();
        file.append("photo",data);
        this.changePhoto(file)
        this.$router.back()
      });
    },
    ...mapActions(["changePhoto"]),
  },
};
</script>

<style scoped lang='less'>
::v-deep .van-nav-bar__arrow {
  color: #fff !important;
}
.van-button--info:nth-of-type(1) {
  position: fixed;
  z-index: 1;
  bottom: 0;
}
.van-button--info:nth-of-type(2) {
  position: fixed;
  z-index: 1;
  bottom: 0;
  right: 0;
}
</style>