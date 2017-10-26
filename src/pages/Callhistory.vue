<template>
<div>
    <h3>通话记录</h3>
    <div class="temp">
        <div class="clearfix handle handle2">
            <div class="fl">
                <Select class="select" @on-change="catselect" >
                    <Option v-for="item in category" :value="item.id"  :key="item.id">{{item.cm_result}}</Option>
                </Select>
                <DatePicker type="date" placeholder="选择日期"  @on-change='startT'></DatePicker>
                 至
                <DatePicker type="date" placeholder="选择日期" @on-change='endT'></DatePicker>
                <Button @click='searchdate'>搜索</Button>
            </div>
            <div class="fr">
                <Input class='search searchinput' v-model="searchvalue" placeholder="请输入姓名或号码进行模糊匹配" style="width: 280px" @on-enter='searchAction' icon="ios-search-strong"></Input>
                <!-- <i class='searchicon_small'></i> -->
                <Button class='search' @click='searchAction'>搜索</Button>
            </div>   
        </div>
        
        <div  class="tableContent">
            <Table :columns="columns1" :data="list"  size="small"></Table>

            <div class="page">
                <Page :total="total" :page-size="pagesize" show-sizer :page-size-opts="[20, 50, 100]" @on-page-size-change="changepagesize" @on-change="changepage"></Page>
            </div>
            <div class="spin" v-if="spinShow">
                <Spin size="large" fix></Spin>
            </div>
        </div>
    </div>
</div>
    
</template>

<script>
    import {formatTime} from '@/assets/js/common.js'
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                spinShow:false,
                // mp3play:true,
                searchvalue:'',
                starttime:"",
                endtime:"",
                pagesize:20,  //每页条数
                page:1,      //页数
                total:0,
                category: [],
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '客户号码',
                        key: 'callee_number',
                        // className:'tablenumber'
                    },
                    {
                        title: '客户名称',
                        key: 'callee'
                    },
                    {
                        title: '坐席',
                        key: 'caller'
                    },
                    {
                        title: '通话时间',
                        width: 230,
                        key: 'time',
                        render: (h, params) => {
                            return h('div',[
                                h('span', params.row.start_time)
                                // h('span', params.row.end_time)
                            ]);
                        }
                    },
                    {
                        title: '通话结果',
                        key: 'result',
                        render: (h, params) => {
                            return h('div',params.row.result.cm_result);
                        }
                    },
                    {
                        title: '通话时长',
                        // width: 250,
                        key: 'audio',
                        render: (h, params) => {
                            return h('div', [
                                // h('progress', {
                                //     attrs: {
                                //         value: '22',
                                //         max: '100',
                                        
                                //     },
                                //     'class':{
                                //         progress:true
                                //     },
                                // }),
                                h('p', this.formatTime(params.row.duration_time)),
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                // h('Button', {
                                //     props: {
                                //         type: 'ghost',
                                //         size: 'small',
                                //         shape:'circle',
                                //         icon:'ios-play-outline',
                                //         disabled:true
                                //     },
                                //     attrs:{
                                //         ref:'btn1',
                                //         value:'pause'
                                //     },
                                //     'class':{
                                //         btn1:true
                                //     },
                                //     style: {
                                //         paddingLeft:'8px',
                                //         marginRight: '22px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.play(params.index,params.row,params.column)
                                //         }
                                //     }
                                // }),
                                // h('audio',{
                                //     // attrs:{
                                //     //     src:this.data[params.index].id
                                //     // },
                                //     'class':{
                                //         audio:true
                                //     },
                                // }),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon:'android-arrow-down',
                                        disabled:params.row.record_filename==''?true:false
                                    },
                                    'class':{
                                        btn2:true
                                    },
                                    on: {
                                        click: () => {
                                            // console.log(params.row.record_filename)
                                            this.download(params.index,params.row,params.column)
                                        }
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                list: [],
                start_time:'',
                end_time:'',
                // downloadstate:true
            }
        },
        methods: {
            formatTime,
            //所有
            getCallRecord(config){
                var that=this;
                that.spinShow = true;
                axios.get('/account/CallRecord/getCallRecord',{
                    params:{
                        first_id:(this.page-1)*this.pagesize,
                        count:this.pagesize,
                        search:this.searchvalue,
                        start_time:this.start_time,
                        end_time:this.end_time,
                        rid:this.typevalue,
                    }
               })
                .then(function(response){
                    console.log(response)
                    if (response.data.data==null) {
                        that.spinShow = false;
                        that.list=[]
                        return
                    }
                    if (response.data.status==0) {
                        that.total=response.data.data.total;
                        that.list=response.data.data.content 
                    }else{
                        console.log(response.data.data)
                        that.$Message.warning(response.data.data);
                    }
                    that.spinShow = false;
                    
                })
                .catch(function(err){
                    console.log(err);
                });
            },
            //日期搜索
            searchdate(){
                this.page=1
                this.getCallRecord();

            },
            //关键字搜索
            searchAction(){
                this.page=1
                this.getCallRecord()
                
            },
            //播放
            play(index,row,column){
                var btn1=document.querySelectorAll('.btn1');
                // var downloadaudio='/account/CallRecord/DownloadVideo?res_token='+this.list[index].res_token+'&id='+this.list[index].id
                
                if (btn1[index].value=="pause") {  // >
                    for (var i = 0; i < btn1.length; i++) {
                        btn1[i].innerHTML='<i class="ivu-icon ivu-icon-ios-play-outline"></i>';
                        btn1[index].innerHTML='<i class="ivu-icon ivu-icon-ios-pause-outline"></i>'
                        btn1[index].value="play"
                    };
                    document.querySelector('.audio').src=downloadaudio;
                    document.querySelector('.audio').play()
                }else{
                    btn1[index].innerHTML='<i class="ivu-icon ivu-icon-ios-play-outline"></i>'
                    document.querySelector('.audio').pause()
                    btn1[index].value="pause"
                }    
            },
            //下载
            download(index,row){
                if (row.record_filename=='') {
                    this.$Message.warning('通话录音不存在');
                    return;
                }else{
                    var btn2=document.querySelectorAll('.btn2');
                    btn2[index].classList.add('btn-finish')
                    window.location.href=this.list[index].record_filename;
                }    
            },
            //选择分类
            catselect(value){
                this.typevalue=value;
                this.getCallRecord({
                    params:{
                        rid:value,
                        search:this.searchvalue
                    }
                })
            },
            startT(a){
                this.start_time=a
            },
            endT(b){
                this.end_time=b
            },
            
            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                this.getCallRecord()
            },
            //切换页数
            changepage(index){
                this.page=index;
                this.getCallRecord()
            },
        },
        mounted(){
            var that=this;
            //获取分类
            axios.get('/account/Customer/GetCallresult')
            .then(function(response){
                if (response.data.status==0) {
                   that.category=response.data.data
                    that.category.push({
                        cm_result:'未分类',
                        id:0
                    })
                };
                
            })
            .catch(function(err){
                console.log(err);
            });
            //获取record
            this.getCallRecord()
        }
    }
</script>
<style>
     .btn-finish{
        color: #00b5ff;
    }
    .btn-finish:after{
        content: '完成';
        position: absolute;
        margin-left: -3px;
    }
    .btn2:before{
        content:'-';
        color: #00b5ff;
        width:20px;
        height:1px;
    }
</style>
<style scoped>
    .ivu-btn{
        color: #fff;
        background-color: #00b5ff;
    }
    .handle{
        margin:20px 0;
    }
    
    .fl div{
        display: inline-block;
    }
    
    .block{
        display: inline-block;
    }
    .select{
        width: 198px;
        height: 34px;
        padding-right: 14px;
        overflow: hidden;
        margin-right: 20px;
    }
    .searchinput{
        width: 208px;
    }
    progress{
        border: 1px solid #00b5ff
    }
   
</style>