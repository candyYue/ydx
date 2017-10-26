<template>
    <div class="loginIn">
        <h1>找回密码</h1>
        <p>欢迎回来</p>
            <div class="findpassword">
                <div>
                    <img src="../../assets/images/login/cell.png" height="20" width="20" alt="" class="cell">
                    <span style="width: 300px"  class="tel">{{tel}}</span>
                </div>
                <div>
                    <Input v-model="vcode" placeholder="请输入验证码" style="width: 300px" @on-enter='check'></Input>
                    <Button  class="getvcode" @click="getvcode">
                      <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
                      <span v-if="!sendMsgDisabled">获取验证码</span>
                    </Button>
                </div>
                <div>
                    <Input v-model="newpwd" placeholder="请输入8-16位密码" :type="password"  style="width: 300px" class="newpwd" @on-enter='check'></Input>
                    
                    
                    <a href="javascript:;" @click='changeAction'>
                        <Icon type="eye-disabled" class='pwdeye' v-if='pwdeye'></Icon>
                        <Icon type="eye" class='pwdeye' v-if='!pwdeye' ></Icon>
                        
                    </a>
                    
                </div>
                <div>
                    <Input v-model="pwdagain" placeholder="请再次输入密码" :type="password"  style="width: 300px" @on-enter='check'></Input>
                </div>
                <div class="lastdiv">
                    <span class="wrong">{{checkmsg}}</span>
                </div>
                
            </div>
            <div class="login-btn">
                <Button type="info"  @click="check"  :loading="loading">登录</Button>
            </div>
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                password:'password',
                tel:'',
                newpwd:"",
                pwdagain:"",
                vcode:'',
                checkmsg:"",
                time:60,
                sendMsgDisabled:false,
                pwdeye:true,
                loading:false
            }
        },
        methods: {
            changeAction(){ 
                if (this.password=='password') {
                    this.password='text'
                    this.pwdeye=false
                }else{
                    this.password='password'
                    this.pwdeye=true
                }
                
            },
            check(){
                if (this.vcode=='') {
                    this.checkmsg="请输入验证码";
                    return
                }
                if(this.newpwd.trim()==""){
                    this.checkmsg="请输入新密码";
                    return
                }
                if(this.pwdagain.trim()==""){
                    this.checkmsg="请再次输入密码";
                    return
                }
                if (this.newpwd!=this.pwdagain) {
                    this.checkmsg="密码输入不一致";
                    return
                }
                this.loginvcode()

            },
            loginvcode(){
                this.loading=true;
                var r_this=this
                $axios('/account/user/resetPwd',{
                        eid:window.localStorage.getItem("eid"),
                        phone:window.localStorage.getItem("phone"),
                        new_password:r_this.newpwd,
                        vcode:r_this.vcode
                },(response)=>{
                  if (response.data.status==0) {
                        r_this.$Message.success('密码重置成功');
                        r_this.$router.push("/summary")
                  }else{
                        r_this.checkmsg=response.data.info
                        r_this.loading=false;
                  }
                })
            },
            getvcode(){
                let that = this;
                that.sendMsgDisabled = true;
                   
                $axios('/account/user/sendVcode',{
                        eid:window.localStorage.getItem("eid"),
                        phone:that.tel
                    },(response)=>{
                        if (response.data.status==0) {
                            let interval = window.setInterval(function() {
                            if ((that.time--) <= 0) {
                                that.time = 60;
                                that.sendMsgDisabled = false;
                                window.clearInterval(interval);
                                }
                            }, 1000); 
                            that.$Message.success('短信验证码已发送，请查收');   
                        }else{
                            that.checkmsg=response.data.info
                        }
                    })        
            }
        },
        mounted(){
            this.tel=window.localStorage.getItem("phone")
        }
    }
</script>

<style scoped>
    a{
        position: absolute;
        right: 90px;
        top: 2px;
    }
    .findpassword{
        position: relative;
    }
    .wrongPWD{
        position: absolute;
        top: 32px;
        left: 70px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .forgetpwd{
        position: absolute;
        top: 32px;
        right: 65px;
        font-size:14px;
        color: #03a9f4;
        line-height: 24px;
    }
    .tel {
        display: inline-block;
        text-align: left;
        padding-left: 30px;
        border-bottom: 1px solid #ccc;
        height: 30px
    }

    .vcode,.newpwd,.pwdagain{
        width: 300px;
    }
    .findpassword>div{
        position: relative;
        margin-bottom: 12px;
    }
    .findpassword .lastdiv{
        margin-bottom: 0px;
        overflow: hidden;
    }
    .cell{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }
     .wrong{
        width: 390px;
        font-size:14px;
        text-align: left;
        float: left;
        color: #ff5e5e;
        padding-left: 90px
    }
    .getvcode{
        position: absolute;
        right: 83px;
        bottom: 1px;
        font-size: 14px;
        color: #03a9f4;
        border:none;
        background-color: #fff;
    }
    .pwdeye{
        font-size: 18px;
        color: #ccc;
        
    }
</style>