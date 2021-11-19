<template>
  <div>
    <van-nav-bar title="登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="mobile"
        name="mobile"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请输入手机号' },
          {
            pattern: /^1[2-9]\d{9}$/,
            trigger: 'onBlur',
            message: '手机号格式有误',
          },
        ]"
      />
      <van-field
        v-model="code"
        name="code"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[
          { required: true, message: '请填写验证码' },
          {
            trigger: 'onBlur',
            pattern: /^\d{6}$/,
            message: '验证码必须为六位',
          },
        ]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isLoading"
          loading-text="登录中..."
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reqLogin } from "../../api";
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      mobile: "",
      code: "",
      isLoading: false,
    };
  },
  methods: {
    async onSubmit(data) {
      this.isLoading = true;
      try {
        const result = await reqLogin(data);
        if (result.message === "OK") {
          this.$toast.success("登录成功");
          this.recordTokenObj(result.data);
          this.getUserInfo();
          if (this.$route.query.backPath) {
            this.$router.replace(this.$route.query.backPath);
          } else {
            this.$router.replace("/layout/home");
          }
        }
      } catch {
        this.$toast.fail("手机号或验证码错误");
      }
      this.isLoading = false;
    },
    ...mapActions(["recordTokenObj", "getUserInfo"]),
  },
};
</script>

<style scoped lang='less'>
</style>