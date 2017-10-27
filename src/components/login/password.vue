<template>
    <div class="loginIn">
        <h1>输入密码</h1>
        <p>欢迎回来</p>
            <div class="password">
                <Input v-model="pwd" placeholder="请输入密码" type="password" style="width: 300px" @on-enter='login'></Input>
                <img src="../../assets/images/login/password.png" height="20" width="20" alt="">
                <span class="wrongPWD">{{wrongtip}}</span>
                <a href="javascript:;" class="forgetpwd" @click="find">忘记密码?</a>
            </div>
            <div class="login-btn">
                <Button type="info"  @click="login" :loading="loading">登录</Button>
            </div>
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    import {trim} from '@/assets/js/common.js';
    export default {
        data: function(){
            return {
                pwd: '',
                wrongtip:"",
                loading:false,
            }
        },
        methods: {
            find(){
                this.$router.push("/findpassword") 
            },
            login(){
                if (this.pwd.trim()=='') {
                    this.wrongtip='请输入密码'
                    return false;
                }
                this.loading=true;
                this.pwd=trim(this.pwd)
                var r_this=this
                $axios('/account/user/Login',{
                    phone:window.localStorage.getItem("phone"),
                    eid:window.localStorage.getItem("eid"),
                    pwd:this.pwd
                },(response)=>{
                    var res=response.data
                    if (res.status==0) {
                        window.localStorage.setItem("username",res.data.username);
                        //首次登陆跳转引导页，强制修改密码弹窗出现
                        if (res.data.has_first_logined==0) {
                            // r_this.$store.state.firstlogin=true
                            r_this.$router.push("/bootpage") 
                        }else{
                            r_this.$router.push("/summary") 
                        }

                        
                        r_this.loading=false;
                        
                    }else if (res.status=='102001') {

                        r_this.$router.push("/summary") 
                        r_this.loading=false;
                        
                    }else if(res.status=='120014' ||res.status=='120015'){
                        r_this.$Message.error({
                            duration:3,
                            content:res.info
                        });
                        r_this.loading=false;
                        r_this.wrongtip='';
                    }else{
                        r_this.wrongtip=res.info;
                        r_this.loading=false;
                    };
                },'post')
            }
        }
    }
</script>

<style scoped>
    .password{
        position: relative;
    }
    .password input{
        padding-left: 30px;
        color: #000;
    }
    .wrongPWD{
        position: absolute;
        top: 32px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .forgetpwd{
        position: absolute;
        top: 32px;
        right: 85px;
        font-size:14px;
        color: #03a9f4;
        line-height: 24px;
    }
    .password img{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }
</style>