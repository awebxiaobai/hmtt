<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item replace to="/layout/home" icon="home-o"
        >标签</van-tabbar-item
      >
      <van-tabbar-item replace to="/layout/queandask" icon="chat-o"
        >标签</van-tabbar-item
      >
      <van-tabbar-item replace to="/layout/video" icon="video-o"
        >标签</van-tabbar-item
      >
      <van-tabbar-item replace to="/layout/mine" icon="user-o"
        >标签</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
};
</script>

<style>
</style>