<template>
    <div>
        <h3>坐席管理</h3>
        <div class="temp">
            <div class="manage">
                <div class="handle handle2">
                    <div class="search">
                        <Input v-model="sname" placeholder="请输入姓名,手机号或坐席号进行搜索" class="sname" @on-keyup='searchAction' style="width: 300px" icon="ios-search-strong"></Input>
                        <a href="javascript:;" class='close' v-if='clearinputicon' @click='clearinput' ><Icon type="ios-close-empty"></Icon></a>
                    </div>

                    <div class="fr">
                        <Button @click="seatAction()"><Icon type="plus"></Icon>新建坐席</Button>
                        <Button type="primary" @click="$store.state.importseat=true"><Icon type="forward"></Icon>批量导入</Button>
                    </div>
                </div>
                <div class="tableContent">
                    <Table   :columns="columns7" :data="$store.state.seatlist" size="small"></Table>
                     
                     <!-- 分页 -->
                    <div class="page">
                        <span class='lefttotal'>共{{$store.state.seattotal}}条数据</span>
                        <Page :total="$store.state.seattotal" :page-size="pagesize" show-sizer @on-page-size-change="changepagesize" @on-change="changepage" :page-size-opts="[20, 50, 100]"></Page>
                    </div>
                </div>    
            </div>
                <!-- 坐席弹窗 -->
            <transition enter-active-class="animated fadeIn">
                <div v-if="seatbox" class="drag-modal-warp">
                <div class="ivu-modal-mask"></div>
                <div class="ivu-modal-wrap">
                    <div class="ivu-modal">
                        <div class="ivu-modal-content drag-modal" v-drag="greet" ref="drag" >
                            <a @click="cancel" class="ivu-modal-close"><Icon type="ios-close-empty"></Icon></a>
                            <div class="ivu-modal-header">
                                <div class="ivu-modal-header-inner">{{seattitle}}</div>
                            </div>
                            <div class="ivu-modal-body">
                                <Form  :label-width="80" ref="formValidate" :model="formValidate" :rules="ruleValidate" >
                                    <FormItem label="坐席名称" prop="newlistname">
                                        <Input v-model="formValidate.newlistname" placeholder='请输入坐席名称' @on-enter="confirmnew('formValidate')" autofocus></Input>
                                    </FormItem>
                                    <FormItem label="坐席号">
                                        <!-- <span>{{formValidate.newlistnumber}}</span> -->
                                        <Input v-model="formValidate.newlistnumber" placeholder='请输入坐席号' @on-enter="confirmnew('formValidate')"></Input>
                                    </FormItem>
                                    <FormItem label="手机号" prop="newlistmobile">
                                        <Input v-model="formValidate.newlistmobile" placeholder='请输入坐席手机号' @on-enter="confirmnew('formValidate')"></Input>
                                    </FormItem>
                                    <FormItem label="登录密码" prop="newlistpwd">
                                        <Input v-model="formValidate.newlistpwd" type='password' placeholder=' 请输入登录密码' @on-enter="confirmnew('formValidate')"></Input>
                                        <span class='tip_'>密码由8~20位英文字母、数字或特殊符号组成</span>
                                    </FormItem>
                                    <div class="error"><p>{{tip}}</p></div>
                                </Form>
                            </div>
                            <div class="ivu-modal-footer">
                                <Button type="primary" @click="confirmnew('formValidate')">确认</Button>
                                <Button @click="cancel">取消</Button>
                            </div>
                        </div>

                    </div>
                </div>
                </div>   
            </transition>
            <!-- 单条删除提醒 -->
            <!-- <transition  enter-active-class="animated fadeIn">
                
            </transition> -->
            <transition enter-active-class="animated fadeIn">
                <Modal v-model="deleteone" width="360" v-if="deleteone">
                <p slot="header">
                    <span>删除提醒</span>
                </p>
                <div style="text-align:center">
                    <p>删除后，坐席将无法恢复。确定删除坐席？</p>
                </div>
                <div slot="footer">
                    <Button type="primary" @click="removesingle">确认</Button>
                    <Button @click="cancel">取消</Button>
                </div>
                </Modal>
            </transition>
        
            <!-- 导入坐席 -->
            <transition enter-active-class="animated fadeIn">
                <Modal v-if="$store.state.importseat" v-model="$store.state.importseat" title="导入坐席" :mask-closable="false" width="580" :footer-hide="true"  class="import-modal">
                    <a slot="close" @click="cancelimport"><Icon type="ios-close-empty"></Icon></a>
                    <stepone v-if="$store.state.steponemark"></stepone>
                    <steptwo v-if="$store.state.steptwomark"></steptwo>
                    <stepthree v-if="$store.state.stepthreemark"></stepthree>
                </Modal>
            </transition>
        </div>
        <!-- <div class="spin" v-if="spinShow">
            <Spin size="large" fix></Spin>
        </div> -->
    </div>
</template>

<script>
    import Vue from 'vue';
    import $axios from '@/assets/js/axios';
    import stepone from '@/components/importseat/stepone.vue' 
    import steptwo from '@/components/importseat/steptwo.vue' 
    import stepthree from '@/components/importseat/stepthree.vue' 
    Vue.directive('drag',
        {bind:function (el, binding) {
                let oDiv = el;   
                let self = this;  
                el.children[1].onmousedown = function (e) {
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    document.onmousemove = function (e) {
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        oDiv.style.left = l + 'px';
                        oDiv.style.top = t + 'px';
                        //清除选中文字
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                        binding.value({x:e.pageX,y:e.pageY})
                    };
                    document.onmouseup = function (e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                     };
                };
            }
        }
    );

    export default {
        data () {
            return {
                clearinputicon:false,
                // spinShow:false,
                tableheight:0,
                sname:'',
                formValidate: {
                    newlistname:"",
                    newlistmobile:"",
                    newlistpwd:'',
                    newlistnumber:"",
                },
                ruleValidate: {
                    newlistname: [
                        { required: true, message: '请输入坐席名称', trigger: 'blur' }
                    ],
                    newlistmobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    newlistpwd: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min:8,max:20, message: '密码由8~20位英文字母、数字或特殊符号组成', trigger: 'blur' },
                    ]
                },
                
                oid:0,
                seattitle:'',
                tip:"",
                // select:0,
                // editseat:false,
                deleteone:false,
                seatbox:false,
                pagesize:20,  //每页条数
                page:1,      //页数
                // total:0,
                columns7: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '坐席号',
                        key: 'number'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '操作',
                        width:120,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon:"ios-compose-outline"
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        
                                        type: 'text',
                                        size: 'small',
                                        icon:"ios-trash-outline"
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index,params.row)
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                list: [],
                newlist:{}
            }
        },
        watch:{
            'sname':function (newval,oldval) {
                (newval!='')?this.clearinputicon=true:this.clearinputicon=false;
            }
        },
        methods: {
            clearinput(){
                this.sname=''
            },
            greet(vm){
                // console.log(vm)
                this.$refs.drag.style.left = vm.x
                this.$refs.drag.style.top = vm.y
            },
            cancelimport(){
                this.$store.state.importseat=false
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
                clearInterval(this.$store.state.getper)
            },
            cancel(){
                this.oid==0
                // this.select=0
                this.seatbox=false
                this.deleteone=false
                this.tip=''
                
                this.formValidate={
                    newlistname:"",
                    newlistmobile:"",
                    newlistpwd:'',
                    newlistnumber:""
                },
                this.getallmember('/account/Operator/getAllmembers',{
                        first_id:(this.page-1)*this.pagesize,
                        count:this.pagesize,
                        search:this.sname
                })
            },
            searchAction(){
                this.page=1
                var that=this
                this.getallmember('/account/Operator/getAllmembers',{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    search:that.sname
                })
            },
            //进入获取所有坐席信息
            getallmember(url,config){
                var that=this
                // that.spinShow = true;
                $axios(url,config,(response)=>{
                    if (response.data.status==0) {
                       that.$store.state.seattotal=response.data.data.total;
                       that.$store.state.seatlist=response.data.data.content
                    };
                    // that.spinShow = false;
                })
            },
            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                var that=this;
                this.getallmember('/account/Operator/getAllmembers',{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
               })
            },
            //切换页数
            changepage(index){
                this.page=index;
                var that=this;
                this.getallmember('/account/Operator/getAllmembers',{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
               })
            },
            // 新建
            seatAction(){
                this.oid=0
                this.seatbox=true
                this.seattitle='新建坐席'
                this.tip=''
                this.formValidate={
                    newlistname:"",
                    newlistmobile:"",
                    newlistpwd:'',
                    newlistnumber:''
                    // newlistnumber:Math.floor(Math.random()*9000 + 1000)
                }
                // this.$refs['formValidate'].resetFields();
            },
            // 编辑
            edit (row) {
                // this.select=row._index;
                this.seattitle = "编辑坐席"
                this.formValidate={
                    newlistname:row.name,
                    newlistnumber:row.number,
                    newlistmobile:row.mobile,
                    newlistpwd:'********',
                }
                this.oid=row.id
                this.seatbox=true
                this.tip=""
                // this.$refs['formValidate'].resetFields();
            },
            //坐席弹框~
            confirmnew(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var that=this; 
                        var url=''
                        if (this.oid==0) {
                            if(this.formValidate.newlistpwd.trim()=='') {
                                this.tip="请输入坐席登录密码"
                                return;
                            }
                            var config={
                                name:that.formValidate.newlistname,
                                number:that.formValidate.newlistnumber,
                                phone:that.formValidate.newlistmobile,
                                pwd:that.formValidate.newlistpwd
                            }
                            url='/account/Operator/addOperator'
                        } else {
                            url='/account/Operator/modifyOperator'
                            var config={
                                name:that.formValidate.newlistname,
                                number:that.formValidate.newlistnumber,
                                phone:that.formValidate.newlistmobile,
                                id:that.oid
                            }
                        }
                        $axios(url,config,(response)=>{
                            if(response.data.status==0){ 
                                that.cancel()
                                if(that.oid==0){
                                    that.$Message.success('新建坐席成功');
                                }else{
                                    that.$Message.success('编辑坐席成功');
                                }
                                that.page=1
                            }else{
                                that.tip=response.data.info
                                
                            }
                        })
                    } 
                }) 
            },

            //删除
            remove (index,row) {
                // this.select=index;
                this.deleteone=true
                this.oid=row.id
            },
            removesingle(){
                var that=this;
                
                $axios('/account/Operator/deleteOperator',{oid:that.oid},(response)=>{
                        if (response.data.status==0) {
                            that.getallmember('/account/Operator/getAllmembers',{
                                first_id:(that.page-1)*that.pagesize,
                                count:that.pagesize,
                                search:that.sname
                            })
                        that.cancel();
                        that.$Message.success('刪除坐席成功')
                    }; 
                })
            }
        },
        components: {
            stepone,
            steptwo,
            stepthree,
        },
        mounted(){
            var that=this;
            this.getallmember('/account/Operator/getAllmembers',{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize,
                    search:that.sname
            })
        }
    }
</script>

<style scoped>
    @import "../assets/css/importclient.css";
    .handle{
        margin-bottom: 20px;
        overflow: hidden;
        position: relative;
    }
    .handle .ivu-input-icon{
        position: absolute;
        left: 0;
    }
    .sname{
        width: 250px;
    }
    .handle button{
        height: 34px;
        border-radius: 3px;
        background-color: #fafafa;
        margin-left: 14px;
        font-size: 12px;
    }
    .handle button:nth-of-type(2){
        background-color: #00b5ff;
        color: #fff
    }
    .handle button:nth-of-type(2) .ivu-icon{
        color: #fff
    }
    .ivu-icon{
        margin-right: 8px;
    }

    .drag-modal{
        position: fixed;
        width: 520px;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 10000;
    }
    .ivu-modal-header{
        cursor: move
    }
    .drag-modal-warp{
        position: fixed;
        z-index: 10;
    }
</style>