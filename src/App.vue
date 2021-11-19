<template>
  <div>
    <keep-alive :include="['SearchNews','Layout']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>


<style lang="less">
</style>
