<template>
    <div class="wrapper">
        <div class="RightContent" :class={bigcontent:isbigcontent}>
            <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
                <div class='mask' v-if="dropshow" @click='dropshow=false'></div>
            </transition>
            <div class="header">
                <a href="javascript:;" class="toggle" @click="toogle"><i></i></a>
                <div class="user-info">
                    <span class="el-dropdown-link">
                        <span class="date">今天是 {{datemg1}}，{{datemg2}}</span>
                        <span class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../assets/images/photo.png">
                        您好！云电销 - 管理员</span>
                    </span>
                    <transition name="custom-classes-transition" enter-active-class="animated fadeIn">
                        <div class="drop" v-if="dropshow">
                            <div class="dropup">
                                <img src="../assets/images/photo.png" alt="" class="userphoto">
                                <h4>{{companyname}} - 管理员</h4>
                                <p>登陆时间：{{datemg1}}，{{datemg2}}</p>
                            </div>
                            <div class="dropdown">
                                <Button class="changpwd" @click="changepwd('formValidate')">修改密码</Button>
                                <Button class="signOut"  @click="signOut">退出登录</Button>
                            </div>
                        </div>
                    </transition>
                </div>

                
            </div>

            <!-- 主体部分 -->
            <transition name="move" mode="out-in"><router-view></router-view></transition>

            <footer>copyright@20142015</footer>   
        </div>
        <div class="sidebar" :class={smallsidebar:issmallsidebar}>
            <div class="logo"><p>云电销企业后台管理</p></div>
            <Col span="8">
            <Menu theme="dark" width='230px'>
                <MenuItem name="1-0" v-if='menuitem'><a href="javascript:;">菜单栏</a></MenuItem>
                <Submenu name="1">
                    <template slot="title"><i class='center'></i><span>统计中心</span></template>
                    <MenuItem name="1-1"><router-link to="/summary" class='innertext'><span>统计概况</span></router-link></MenuItem>
                    <MenuItem name="1-2"><router-link to="/count" class='innertext'><span>坐席统计</span></router-link></MenuItem>
                </Submenu>

                <MenuItem name="1-3"><router-link to="/link"><i class='client'></i><span>线索池</span></router-link></MenuItem>
                <MenuItem name="1-4"><router-link to="/manage"><i class='seat'></i><span>坐席管理</span></router-link></MenuItem>
                <MenuItem name="1-5"><router-link to="/callhistory"><i class='callhistory'></i><span>通话记录</span></router-link></MenuItem>
            </Menu>
        </Col>
        </div>

        
        <!-- 修改密码 -->
        <!-- 首次登陆修改密码 -->

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
                menuitem:true,
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
            
            console.log(11111)
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
                this.menuitem=!this.menuitem
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
        width:230px;
        font-weight: 700;
        text-align: center;
        font-size: 16px;
        padding-left: 20px;
        background: url(../assets/images/smalllogo.png) no-repeat 15px center;
        background-color: #00b5ff;
        color: #fff;
    }
    .user-info {
        float: right;
        padding-right: 28px;
        font-size: 16px;
        height: 54px;
    }
    .user-info .date{
        font-size: 14px;
        color: #999;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        height: 54px;
    }
    .user-info .welcome{
        display: inline-block;
        height: 52px;
        width: 260px;
        padding:0 14px 0 64px;
        position: relative;
        color: #303030;
        cursor: pointer;
        font-size: 14px
    }
    .user-info .welcome:hover{
        background-color: #fafafb;
    }
    .user-info .user-logo{
        position: absolute;
        margin: 0 10px;
        left: 14px;
        top: 10px;
        width:26px;
        height:26px;
        border-radius: 50%;
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
    .sidebar{
        overflow: hidden;
        display: block;
        position: absolute;
        width: 230px;
        left: 0;
        top: 0;
        bottom:0;
        background-color: #232b3e;
        transition: all .2s cubic-bezier(0.13, 0.75, 0.58, 1);
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
        padding:0;
    }
    .sidebar a{
        display: block;
        width: 100%;
        height: 100%;
        padding: 14px 21px;
        cursor: pointer;
    }
    .sidebar .innertext{
        padding: 14px 49px;
    }
    .RightContent{
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom:0;
        left: 230px;
        width: auto;
        box-sizing: border-box;
        overflow-y: scroll;
        transition: all .15s cubic-bezier(0.13, 0.75, 0.58, 1);
    }
    .smallsidebar{width: 50px}
    .bigcontent{left: 50px;}
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
    .drop{
        width: 260px;
        height: 230px;
        border:1px solid #ccc;
        border-radius: 3px;
        position: absolute;
        right: 28px;
        top: 55px;
        z-index: 99;
        background-color: #fafafa;
    }
    .dropup{
        width: 100%;
        background-color: #00b5ff;
        padding-top: 10px;
        text-align: center;
    }
    .userphoto{
        display: block;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        margin:0 auto 14px;
        box-shadow: 0 0 2px 4px #00a4e2;
    }
    .dropup h4{
        margin: 0;
        padding: 0;
        font-size: 16px;
        color: #fff;
        line-height: 20px;
    }
    .dropup p{
        font-size: 12px;
        color: #c6e3f5;
        line-height: 14px;
        margin-top: 8px;
        padding-bottom: 20px
    }
    .dropdown{
        height: 56px;
        padding: 14px;
        position: relative;
    }
    .dropdown button{
        width: 88px;
        height: 34px;
        background-color: #f4f4f4;
        color: #333;
        border:1px solid #ddd;
        font-size: 14px;
    }
    .changpwd{
        position: absolute;
        left: 15px;
        top: 15px;
    }
    .signOut{
        position: absolute;
        right: 15px;
        top: 15px;
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
    a:hover{
        color:#bfcbd9
    }
    /* .ivu-form-item{
        margin-bottom: 24px
    } */
    
    .sidebar i{
        vertical-align: middle;
        display: inline-block;
        width: 15px;
        height: 15px;
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
