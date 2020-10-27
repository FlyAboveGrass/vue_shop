<template>
  <div class="content-box">
      <div class="login-box"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .content-box{
    position: relative;
    height: 100%;
    width: 100%;
    background-color: rgba(36,70,103);
  }
  .login-box{
    width: 300px;
    height: 550px;
    background-color: white;
    position: absolute;
    top: 50%;
    right: 20%;
    transform: translate(0, -50%);
  }
</style>