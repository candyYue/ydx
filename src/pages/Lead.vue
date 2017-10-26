<template>
    <div class="wrapper">        
        <div class="content">
            <div class="header">
                <a href="javascript:;" class="toggle"><Icon type="navicon"></Icon></a>
                <div class="user-info">
                    <span class="el-dropdown-link">
                        <span class="date">今天是{{datemg1}}，{{datemg2}}</span>
                        <span class="welcome" @click="dropshow=!dropshow">
                        <img class="user-logo" src="../assets/images/photo.png">
                        您好！电销通 - 管理员</span> 
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
                                <div  :class={newhighlight:show2}><Button icon="bluebtn" type="info">批量导入</Button> </div>
                                <div><Button icon="reply" type="info">全部导出</Button></div>   
                            </div>
                        </div>
                        <div v-if='seat'  class="clearfix">
                            <div class="temp2">
                                <div :class={newhighlight:show1}><Button icon="plus">新建线索</Button></div>
                                <div ref="page1":class={newhighlight:show1}><Button icon="bluebtn" type="info">批量导入</Button></div> 
                            </div>
                        </div>
                        <div class="tableContent">
                        <Table   :columns="columns7" :data="list" size="small"></Table>
                    </div>
                    </div>
                    
                </div>
            </transition>
            
            <footer>copyright@20142015</footer>                
        </div>
        <div class="sidebar">
            <div class="logo"><p>云电销企业后台管理</p></div>
            <Col span="8">
            <Menu theme="dark" width='230px'>
                <MenuItem name="1-0">菜单栏</MenuItem>
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-pie-outline"></Icon>
                        统计中心
                    </template>
                    <MenuItem name="1-1">统计概况</MenuItem>
                    <MenuItem name="1-2">坐席统计</MenuItem>
                </Submenu>
                
                <MenuItem name="1-3"><Icon type="ios-paper-outline"></Icon>线索池</MenuItem>
                <MenuItem name="1-4"><Icon type="ios-grid-view-outline"></Icon>坐席管理</MenuItem>
                <MenuItem name="1-5"><Icon type="document"></Icon>通话记录</MenuItem>
            </Menu>
        </Col>
        </div>
        
        <!-- 新手指导页面1 -->
        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mark1 clearfix" v-if="show1">
                 <div class="side-width"></div>
                 <div class="mask-right">
                     <div class="img1" ref='img1' v-if="show1">
                         <p class="tip1">为了保障坐席人员的使用，建议您先在坐席管理页面新建坐席或批量导入坐席 </p>
                         <Button type="info" @click="mark2">下一步</Button>
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
                     <Button type="info" @click="mark3">下一步</Button>
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
                     <Button type="info" @click="markend">完成</Button>
                 </div>
            </div>
            </div>
        </transition>

    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
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
                dropshow:false,
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

            console.log(parseInt(this.$refs.page1.offsetTop+120)+'px')
            console.log(parseInt(this.$refs.page1.offsetLeft-1000)+'px')

            var img1 = window.getComputedStyle ? window.getComputedStyle(this.$refs.img1,null) : null || this.$refs.img1.currentStyle;
        
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
        width:230px;
        text-align: center;
        font-size: 16px;
        background-color: #00b5ff;
        color: #fff;
    }
    .user-info {  
        float: right;
        padding-right: 28px;
        font-size: 16px;
    }
    .user-info .date{
        font-size: 12px;
        color: #999;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .welcome{
        margin-left: 50px;
        position: relative;
        color: #303030;
        font-size: 12px
    }
    .user-info .user-logo{
        position: absolute;
        margin: 0 10px;
        left: -50px;
        top: -5px;
        width:26px;
        height:26px;
        border-radius: 50%;
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
    a{
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
        text-align: center;
    }
    .toggle i{
        font-size: 28px;
        line-height: 50px;
    }
</style>
