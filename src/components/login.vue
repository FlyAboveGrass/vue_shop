<template>
  <div class="content-box">
      <div class="login-box">
        <div class="avatar">
          <el-avatar class="avatar-icon" size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" shape="circle"></el-avatar>
        </div>
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="login_form" :inline="false" size="normal">
          <el-form-item label-width="0px" size="medium" prop="userName">
            <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.userName" placeholder="请输入账号" size="normal" clearable></el-input>
          </el-form-item>
          <el-form-item label-width="0px" prop="password">
            <el-input prefix-icon="el-icon-key" v-model="loginForm.password" type="password" placeholder="请输入密码" size="normal" clearable></el-input>
          </el-form-item>
          <div class="el-form-item login-btn">
            <el-button type="primary" size="small" :round="true" @click="onSubmit() ">登录</el-button>
            <el-button size="small" :round="true" @click="onReset()">重置</el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        userName: '',
        password: '',
      },
      rules: {
        // 验证规则的名称一定要与loginForm中的字段名保持一致，不然会失效
        userName: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
      

    }
  },
  methods: {
    onSubmit() {
      this.$refs.login_form.validate(result => {
        if(!result){
          this.$message.error('表单数据有误！')
          return ;
        }
        this.$http.post('/login', {
          username: this.loginForm.userName,
          password: this.loginForm.password
        }).then(res => {
          console.log(res.data);
          if(res.data.meta.status !== 200){
            this.$message.error('用户名或密码有误');
            return ;
          }
          window.sessionStorage.setItem('token', res.data.data.token);
          this.$router.push('/home')
        });
      });
      
    },
    onReset() {
      this.$refs.login_form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .content-box{
    position: relative;
    height: 100%;
    width: 100%;
    background: url(../assets/img/login-bg.jpg) center center no-repeat;
    background-size: cover;
  }
  .login-box{
    width: 300px;
    height: 550px;
    background-color: white !important;
    position: absolute;
    top: 50%;
    right: 20%;
    transform: translate(0, -50%);
    display: flex;
    flex-direction: column;
  }
  .avatar{
    width: 100%;
    height: 200px;
    position: relative;
    .avatar-icon{
      width: 100px;
      height: 100px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .login-form{
    width: 100%;
    height: 350px;
    .el-form-item{
      width: 80%;
      margin: 22px auto;
      box-sizing: border-box;
    }
    .login-btn{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .el-form-item__content{
        margin: 0;
      }
    }
  }
</style>