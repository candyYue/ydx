<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="loginLeft">
                <img src="../../static/images/logo.png" height="80" width="80" alt="">
                <p class="title">云电销管理后台</p>
                <p class='logotext'>
                    <span>南京易米云通网络科技有限公司 版权所有 苏ICP备08006818号</span>
                </p>
            </div>

            <div class="loginRight">

                <router-view></router-view>
                
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data: function(){
            return {
                
            }
        },
        
        methods: {
            
        },
        mounted(){
            
        }
    }
</script>

<style scoped>
    @import "../assets/css/login.css";
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: linear-gradient(to bottom right, #dedcf1, #aecae2);
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%); 
        width:1066px;
        height:600px;
        box-shadow: 5px 5px  10px 0 #a5c8df
    }
    .title{
        font-size: 30px;
        position: absolute;
        top: 200px;
        left: 50%;
        transform:translateX(-50%) 
    }
    .loginLeft{
        float: left;
        width: 600px;
        height: 100%;
        background: url(../../static/images/bg.png) no-repeat center;
        color: #fff;
        font-size: 14px;
        position: relative;
    }
    .loginLeft img{
        position: absolute;
        top: 112px;
        left: 50%;
        transform:translate(-50%);
        box-shadow: 5px 5px  10px #76c3e7
    }
    .logotext{
        width: 100%;
        position: absolute;
        text-align: center;
        bottom: 16px;
    }
    .logotext span{
        z-index:2;
        position: relative;
        padding:0 10px;
    }
    .logotext:before{
        content: '';
        display: inline-block;
        width:67px;
        height:1px;
        background-color:#fff;
        position:absolute;
        bottom:50%;
        z-index:1;
        left:30px;
        opacity: .8
    }
    .logotext:after{
        content: '';
        display: inline-block;
        width:67px;
        height:1px;
        background-color:#fff;
        position:absolute;
        bottom:50%;
        z-index:1;
        right:30px;
        opacity: .8
    }
    .loginRight{
        text-align: center;
        float: right;
        width: 466px;
        height: 100%;
        background-color: #fff;
    }
</style>