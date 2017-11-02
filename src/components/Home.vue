<template>
    <div class="wrapper">
        <div class="RightContent" :class="{bigcontent:isbigcontent}">
            <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
                <div class='mask' v-if="dropshow" @click='dropshow=false'></div>
            </transition>
            <div class="header">
                <!-- 侧边栏切换 -->
                <a href="javascript:;" class="toggle" @click="toogle"><i></i></a>
                <!-- right -->
                <div class="user-info">
                    <button class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../assets/images/homephoto.png">
                        <span>易米云通</span>
                        <Icon type="chevron-down"></Icon>
                    </button>
                    <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
                        <div class="drop" v-show="dropshow">
                            <a href="javascript:;" class="changpwd" @click="changepwd('formValidate')">修改密码</a>
                            <a href="javascript:;" class="signOut"  @click="signOut">退出登录</a>
                        </div>
                    </transition>
                </div>

                
            </div>

            <!-- 主体部分 -->
            <transition name="move" mode="out-in"><router-view></router-view></transition>

            <footer>copyright@2017 南京易米云通网络科技有限公司 版权所有 苏ICP备08006818号</footer>   
        </div>
        <div class="sidebar" :class="{issmallsidebar:issmallsidebar}">
            <div class="logo"> <img src="../assets/images/smalllogo.png"/> <span class="layout-text">云电销企业后台管理</span></div>
            <!-- <Col span="8"> -->
            <Menu theme="dark"  width="auto">
                <p class="menu-item-title-text">菜单栏</p>
                <!-- <MenuItem name="1-0"><a href="javascript:;" class="menu-item-title">菜单栏</a></MenuItem> -->
                <Submenu name="1">
                    <template slot="title"><i class='center'></i><span class="layout-text">统计中心</span></template>
                    <MenuItem name="1-1"><router-link to="/summary" class='innertext'><span>统计概况</span></router-link></MenuItem>
                    <MenuItem name="1-2"><router-link to="/count" class='innertext'><span>坐席统计</span></router-link></MenuItem>
                </Submenu>

                <MenuItem name="1-3"><router-link to="/link"><i class='client'></i><span class="text">线索池</span></router-link></MenuItem>
                <MenuItem name="1-4"><router-link to="/manage"><i class='seat'></i><span class="text">坐席管理</span></router-link></MenuItem>
                <MenuItem name="1-5"><router-link to="/callhistory"><i class='callhistory'></i><span class="text">通话记录</span></router-link></MenuItem>
            </Menu>
        <!-- </Col> -->
        </div>

        
        <!-- 修改密码 -->
        <!-- 首次登陆修改密码 -->
    <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
        <Modal v-model="$store.state.changebox" :closable="$store.state.closable" :mask-closable="$store.state.mask_closable">
            <p slot="header">
                <span>修改密码</span>
            </p>
            <Form label-position="right" :label-width="80" ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <FormItem label="用户名">
                    <span>{{companyname}}</span>
                    <span class='changepwd'>修改密码</span>
                </FormItem>
                <FormItem label="原密码" prop="oldpwd">
                    <Input v-model="formValidate.oldpwd" @on-enter="confirmpwd('formValidate')" placeholder='请输入原密码' autofocus></Input>
                </FormItem>
                <FormItem label="新密码" prop="newpassword">
                    <Input v-model="formValidate.newpassword" type='password' placeholder='请输入新密码' @on-enter="confirmpwd('formValidate')"></Input>
                    <span class='tip_'>密码由8~20位英文字母、数字或特殊符号组成</span>
                </FormItem>
                <FormItem label="确认密码" prop="passwordagain">
                    <Input v-model="formValidate.passwordagain" type='password' @on-enter="confirmpwd('formValidate')" placeholder='请确认新密码'></Input>
                </FormItem>
                <div class="error"><p>{{tip}}</p></div>
            </Form>
            <div slot="footer">
                <Button type="primary"  @click="confirmpwd('formValidate')">确认</Button>
                <Button @click="cancel" v-if='$store.state.closable'>取消</Button>
            </div>
        </Modal>
    </transition>
        <!-- 过期提醒 -->
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    import Bus from '@/assets/js/bus.js';

    export default {
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认密码'));
                } else if (value !== this.formValidate.newpassword) {
                    callback(new Error('新旧密码输入不一致!'));
                } else {
                    callback();
                }
            };
            return {
                formValidate:{
                    oldpwd:"",
                    newpassword:"",
                    passwordagain:"",
                },
                companyname:'',
                username:'',
                tablewidthsmall:'',
                tablewidthlarge:'',
                datemg1: '',
                datemg2:'',
                dropshow:false,
                tip:"",
                issmallsidebar:false,
                isbigcontent:false,
                ruleValidate:{
                    oldpwd: [
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    newpassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min:8,max:20, message: '密码由8~20位英文字母、数字或特殊符号组成', trigger: 'blur' },
                    ],
                    passwordagain: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ],
                }
            }
        },

        mounted(){
            
            //禁止页面后退
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
            
            var date = new Date();
            var year=date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.datemg1=year+'年'+month+'月'+day+'日';
            var arr = new Array("日", "一", "二", "三", "四", "五", "六");
            var week = new Date().getDay();
            this.datemg2 = "星期"+ arr[week];
            this.username=window.localStorage.getItem("username");
            this.companyname=window.localStorage.getItem("companyname");
            this.username=window.localStorage.getItem("username");
            
            console.log(this.$store.state.endday)
            if (0<=this.$store.state.endday&&this.$store.state.endday<=30) {
                this.instance()  //过期提醒
            }
        
        },
        methods:{
            instance () {
                const title = '过期提醒';
                const content = '<p>您的云电销将于'+this.$store.state.endday+'天后到期，为了不影响您的继续使用，请联系客户经理进行续费。</p>';
                this.$Modal.warning({
                    title: title,
                    content: content,
                    onOk: () => {
                        this.$store.state.endday=-1
                    },
                });
            },
            cancel(){
                this.$store.state.changebox=false
                this.formValidate={
                    oldpwd:"",
                    newpassword:"",
                    passwordagain:"",
                },
                this.tip="";
            },
            toogle(){
                let timer = null;
                this.issmallsidebar=!this.issmallsidebar;
                this.isbigcontent=!this.isbigcontent;
                timer = setTimeout(()=>{
                    Bus.$emit('resizeChart')
                    clearTimeout(timer);
                },205)
            },
            signOut(){
                this.$store.state.endday=-1
                var that=this;
                $axios('/account/user/logout',{},(response)=>{
                    if(response.data.status==0){
                        that.dropshow=false
                        window.localStorage.clear();  //清除localstorage
                        that.$router.push("/login")
                    }
                })
            },
            changepwd(name){
                this.$store.state.changebox=true;
                this.dropshow=false;
                this.formValidate={
                    oldpwd:"",
                    newpassword:"",
                    passwordagain:"",
                }
                this.$refs[name].resetFields();
            },
            // 提交新密码
            confirmpwd(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.changepassword()
                    }
                })
            },


            changepassword(){
                var that=this;
                let config = {
                    eid:window.localStorage.getItem("eid"),
                    phone:window.localStorage.getItem("phone"),
                    old_password:that.formValidate.oldpwd,
                    new_password:that.formValidate.newpassword
                }
                $axios('/account/user/resetPwd',config,(response)=>{
                    if (response.data.status==0) {
                        that.$Message.success('密码修改成功');
                        that.cancel()
                        that.$store.state.changebox=false;
                        this.$store.state.closable=true
                        this.$store.state.mask_closable=true
                        Bus.$emit('renderSummary')
                    }else{
                        that.tip=response.data.info;
                        return
                    }
                })
            }
        }
    }
</script>
<style scoped>
    @import "../assets/css/bootpage.css";
    a {
        color: #bfcbd9;
    }
    .mask{
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: transparent;
        opacity: 0;
        z-index: 1
    }
    .header {
        position: relative;
        box-sizing: border-box;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #ccc;
    }
    .logo{
        transition: all .2s cubic-bezier(0.13, 0.75, 0.58, 1);
        height: 54px;
        line-height: 54px;
        /* width:230px; */
        font-weight: 700;
        text-align: left;
        font-size: 16px;
        background-color: #00b5ff;
        color: #fff;
        padding-left: 13px;
    }
    .logo img{
        vertical-align: middle;
        width: 25px;
        margin-right: 13px;
    }
    .user-info {
        float: right;
        padding-right: 28px;
        font-size: 16px;
        height: 54px;
    }
    
    .welcome{
        background-color: #fff;
        text-align: center;
        outline: none;
        border: none;
        display: inline-block;
        line-height: 52px;
        width: 128px;
        position: relative;
        color: #303030;
        font-size: 14px;
        cursor: pointer;
    }
    .welcome span{
        margin-left: 6px;
        margin-right: 8px;
    }

    .welcome:hover,
    .welcome:focus{
        background-color: #fafafb;
        border: 1px solid #eaeaea
    }

    .welcome i{
        transition: all .25s ease-in-out;
    }
    .welcome:focus i{
        transform: rotate(180deg);
    }
    .drop{
        width: 128px;
        border:1px solid #eaeaea;
        border-top: none;
        border-radius: 3px;
        position: absolute;
        right: 28px;
        top: 54px;
        z-index: 99;
        background-color: #fff;
    }

    .drop a:hover{
        background: #edf9ff;
        color: #03a9f4;
    }
    .changpwd,.signOut{
        display: block;
        width: 100%;
        height: 40px;
        color: #666;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
    }
    .user-logo{    
        vertical-align: middle;
    }

    .toggle{
        display: inline-block;
        width: 54px;
        height: 54px;
        text-align: center;
        
    }
    .toggle i{
        display: block;
        width: 15px;
        height: 12px;
        margin: 19px auto;
        background: url(../assets/images/1.png) no-repeat 0 -69px;
    }
   
    .RightContent{
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        z-index: 0;
        right: 0;
        top: 0;
        bottom:0;
        left: 230px;
        width: auto;
        box-sizing: border-box;
        overflow-y: scroll;
        transition: all .15s cubic-bezier(0.13, 0.75, 0.58, 1);
    }

    .bigcontent{left: 56px;}
    li>a{
        display: block;
        width: 100%;
        height: 100%;
    }
    footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 50px;
        padding-left: 36px;
        font-size: 14px;
        line-height: 50px;
        color: #666;
        background-color: #fafafb;
        border: 1px solid #e6e6e6;
        /* z-index: 99; */
    }
    
    .changepwd{
        color: #999;
        position: absolute;
        left: -60px;
        top: 20px;
    }
    .changepwd:after{
        content: '';
        display: inline-block;
        width:380px;
        height:1px;
        background-color:#ccc;
        position:absolute;
        bottom:50%;
        z-index:1;
        left:60px;
        opacity: .8
    }
    .ivu-btn{
        width: 80px;
    }
   
    
    .sidebar i{
        vertical-align: middle;
        display: inline-block;
        width: 15px;
        height: 16px;
        margin-right: 15px;
        font-size:16px;

    }

    .center{
        background: url(../assets/images/1.png) 0 -25px;
    }
    .client{
        background: url(../assets/images/1.png) -75px -25px;
    }
    .seat{
        background: url(../assets/images/1.png) -90px -25px;
    }
    .callhistory{
        background: url(../assets/images/1.png) -105px -25px;
    }
</style>
