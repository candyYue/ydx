<template>
    <div class="wrapper">        
        <div class="content">
            <div class="header">
                <!-- 侧边栏切换 -->
                <a href="javascript:;" class="toggle"><i></i></a>
                <!-- right -->
                <div class="user-info">
                    <span class="welcome">
                        <img class="user-logo" src="../assets/images/homephoto.png">
                        <span>易米云通</span>
                        <Icon type="chevron-down"></Icon>
                    </span>
                </div>    
            </div>

            <!-- 主体部分 -->
            <transition name="move" mode="out-in">
                <div>
                    <h3 class="title" v-if='seat'>坐席管理</h3>
                    <h3 class="title" v-if='client'>线索池</h3>
                    <div class="temp">
                        <div v-if='client' class="clearfix">
                            <ul class="link">
                                <li class='linktab'><router-link to="/link">线索池</router-link></li>
                                <li class='linktab'><router-link to="/phoneresult">通话结果管理</router-link></li>
                            </ul>
                            <div class="temp2 clearfix">
                                <div><Button icon="trash-a">删除</Button></div>
                                <div :class={newhighlight:show3}><Button icon="android-person">分配线索</Button></div>
                                <div><Button icon="plus">新建线索</Button></div>
                                <div  :class={newhighlight:show2}><Button icon="bluebtn" type="primary">批量导入</Button> </div>
                                <div><Button icon="reply" type="primary">全部导出</Button></div>   
                            </div>
                        </div>
                        <div v-if='seat'  class="clearfix">
                            <div class="temp2">
                                <div :class={newhighlight:show1}><Button icon="plus">新建线索</Button></div>
                                <div ref="page1":class={newhighlight:show1}><Button icon="bluebtn" type="primary">批量导入</Button></div> 
                            </div>
                        </div>
                        <div class="tableContent">
                        <Table   :columns="columns7" :data="list" size="small"></Table>
                    </div>
                    </div>
                    
                </div>
            </transition>
            
            <footer>copyright@2017 南京易米云通网络科技有限公司 版权所有 苏ICP备08006818号</footer>                
        </div>
        <div class="sidebar">
            <div class="logo"><img src="../assets/images/smalllogo.png"/> <span>云电销企业后台管理</span></div>
            
            <Menu theme="dark"  width="auto">
                <p class="menu-item-title-text">菜单栏</p>
                <!-- <MenuItem name="1-0"><a href="javascript:;" class="menu-item-title">菜单栏</a></MenuItem> -->
                <Submenu name="1">
                    <template slot="title"><i class='center'></i><span>统计中心</span></template>
                    <MenuItem name="1-1"><router-link to="/summary"><span>统计概况</span></router-link></MenuItem>
                    <MenuItem name="1-2"><router-link to="/count"><span>坐席统计</span></router-link></MenuItem>
                </Submenu>

                <MenuItem name="1-3"><router-link to="/link"><i class='client'></i><span>线索池</span></router-link></MenuItem>
                <MenuItem name="1-4"><router-link to="/manage"><i class='seat'></i><span>坐席管理</span></router-link></MenuItem>
                <MenuItem name="1-5"><router-link to="/callhistory"><i class='callhistory'></i><span>通话记录</span></router-link></MenuItem>
            </Menu>
        </div>
        
        <!-- 新手指导页面1 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark1 clearfix" v-if="show1">
                 <div class="side-width"></div>
                 <div class="mask-right">
                     <div class="img1" ref='img1' v-if="show1">
                         <p class="tip1">为了保障坐席人员的使用，建议您先在坐席管理页面新建坐席或批量导入坐席 </p>
                         <Button type="primary" @click="mark2">下一步</Button>
                     </div>
                 </div>
                 
            </div>
        </transition>
        <!-- 新手指导页面2 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark2 clearfix" v-if="show2">
            <div class="side-width"></div>
            <div class="mask-right">
                 <div class="img2" v-if="show2">
                     <p class="tip2">创建完坐席后，您可以在线索池页面批量导入客户号码 </p>
                     <Button type="primary" @click="mark3">下一步</Button>
                 </div>
            </div>
            </div>
        </transition>
        <!-- 新手指导页面3 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark3 clearfix" v-if="show3">
            <div class="side-width"></div>
            <div class="mask-right">
                <div class="img3" v-if="show3">
                     <p class="tip3">导入完客户列表后，您可以选择客户，点击分配坐席，将选择的客户分配给对应的坐席，分配完成之后，坐席登录客户端就可以直接使用 </p>
                     <Button type="primary" @click="markend">完成</Button>
                 </div>
            </div>
            </div>
        </transition>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                client:false,
                seat:true,
                show1:true,
                show2:false,
                show3:false,
                datemg1: '',
                datemg2:'',
                changebox:false,
                tip:"",
                columns7: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'cm_mobile'
                    },
                    {
                        title: '名称',
                        key: 'cm_name'
                    },
                    {
                        title: '公司名称',
                        key: 'cm_company'
                    },
                    {
                        title: '坐席',
                        key: 'seat',
                        
                    },
                    {
                        title: '通话结果',
                        key: 'cm_result'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                    {
                        title: '备注',
                        key: 'cm_detail'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                      type: 'text',
                                      icon: "ios-compose-outline"
                                    }
                                }),
                                h('Button', {
                                    props: {
                                      type: 'text',
                                      icon: "ios-trash-outline"
                                    },
                                })
                            ]);
                        }
                    }
                ],
                list:[]
            }
        },
        mounted(){
            var date = new Date();
            var year=date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.datemg1=year+'年'+month+'月'+day+'日';
            var arr = new Array("日", "一", "二", "三", "四", "五", "六");  
            var week = new Date().getDay();  
            this.datemg2 = "星期"+ arr[week];  


            // var img1 = window.getComputedStyle ? window.getComputedStyle(this.$refs.img1,null) : null || this.$refs.img1.currentStyle;
        
        },
        methods:{
            mark2(){ 
                this.seat=false;
                this.show1=false;
                this.client=true;
                this.show2=true;
            },
            mark3(){
                this.show2=false;
                this.show3=true;
            },
            markend(){
                this.$router.push("/summary")
                this.$store.state.changebox=true
                this.$store.state.closable=false
                this.$store.state.mask_closable=false
                this.show3=false;
            }
        }
    }
</script>
<style scoped>
    @import "../assets/css/mark.css";
    @import "../assets/css/bootpage.css";
    .header {
        position: relative;
        box-sizing: border-box;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #ccc;
    }
    .logo{
        line-height: 54px;
        line-height: 54px;
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
    
   
    .user-info .welcome{
        position: relative;
        color: #303030;
        font-size: 14px;
        display: inline-block;
        line-height: 52px;
        vertical-align: middle;
    }
    .welcome img{
        vertical-align: middle;
    }
     .welcome span{
        margin-left: 6px;
        margin-right: 8px;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 230px;
        left: 0;
        top: 0;
        bottom:0;
        background-color: #222c3e;
    }
    .sidebar a{
        display: block;
        width: 100%;
        height: 100%;
        color: #ccc
    }
    .sidebar i{
        vertical-align: middle;
        display: inline-block;
        width: 15px;
        height: 16px;
        margin-right: 15px;
        font-size:16px;

    }
    .content{
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom:0;
        left: 230px;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .temp2{
        float: right;
    }
    .temp2>div{
        padding: 12px 12px;
        position: relative;
        display: inline-block;
        background-color: #fff;
        border-radius: 4px;
    }
    .link{
        margin:40px 0 20px;
        border-bottom: 1px solid #ccc;
    }
    .link .linktab{
        float: left;
        margin-bottom: -1px;
    }
    .link .linktab:nth-of-type(1){
        margin-left: 10px;
    }
    .linktab a{
        display: inline-block;
        line-height: 50px;
        height: 51px;
        padding: 0 20px;
        border: 1px solid #ccc;
        border-bottom: none;
        background-color: #f4f4f4;
        font-size: 16px;
        color: #333;
    }
    .linktab:nth-of-type(1) a{
        border-right: none;
        background-color: #fff;
        border-top: 3px solid #00b5ff;
        border-bottom: 1px solid #fff
    }
    footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        height: 50px;
        padding-left: 36px;
        font-size: 12px;
        line-height: 50px;
        color: #666; 
        background-color: #fafafb;
        border: 1px solid #e6e6e6;
    }
     .link{
        margin:40px 0 20px; 
        height: 46;
        line-height: 46px;
        border-bottom: 1px solid #ccc;
    }
    /* .ivu-menu-dark{
        background-color: transparent;
    } */
    .temp>div{
        margin-bottom: 20px
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
