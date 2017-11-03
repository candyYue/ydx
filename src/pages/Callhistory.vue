<template>
<div>
    <h3>通话记录</h3>
    <div class="temp">
        <div class="clearfix handle handle2">
            <div class="fl">
                <Select class="select" @on-change="catselect" placeholder='请选择通话结果'>
                    <p v-if='!category.length'>暂无匹配数据</p>
                    <Option v-else v-for="item in category" :value="item.id"  :key="item.id">{{item.cm_result}}</Option>
                </Select>
                <DatePicker type="date" placeholder="选择日期"  @on-change='startT'></DatePicker>
                 至
                <DatePicker type="date" placeholder="选择日期" @on-change='endT'></DatePicker>
                <Button @click='searchdate'>搜索</Button>
            </div>
            <div class="fr">
                <div class="search">
                    <Input class='searchinput' v-model="searchvalue" placeholder="请输入姓名或号码进行模糊匹配" style="width: 280px" @on-enter='searchAction' icon="ios-search-strong"></Input>
                    <a href="javascript:;" class='close'  v-if='clearinputicon' @click='clearinput'><Icon type="ios-close-empty"></Icon></a>
                </div>
                
                <Button @click='searchAction'>搜索</Button>
            </div>   
        </div>
        
        <div  class="tableContent aodiotable">
            <Table :columns="columns1" :data="list"  size="small"></Table>

            <div class="page">
                <span class='lefttotal'>共{{total}}条数据</span>
                <Page :total="total" :page-size="pagesize" show-sizer :page-size-opts="[20, 50, 100]" @on-page-size-change="changepagesize" @on-change="changepage"></Page>
            </div>
            <div class="spin" v-if="spinShow">
                <Spin size="large" fix></Spin>
            </div>
        </div>

        <!-- 播放音頻 -->
        <transition enter-active-class="animated fadeIn">
            <Modal v-model="playrecord" width="694" v-if="playrecord">

                
                <p slot="header">
                    <span>播放录音</span>
                </p>
                <div class="audiobody">
                    <div v-show="loadingShow" class="spin">
                        <Spin fix >
                            <Icon type="load-c" size=28 class="demo-spin-icon-load"></Icon>
                            <span class='loadtext'>正在加载，请稍后...</span>
                        </Spin>
                    </div>
                    <div  class="mp3Btn" v-show="!loadingShow">
                        <a href="javascript:;" class="state" @click='play'><Icon :type="stateicon"></Icon></a>
                        <div class='audioprogress'><Slider v-model="progress1" @on-change='audioprogressplay'></Slider></div>
                        <span>{{currentTime}}/{{duration}}</span>
                        <audio id="mp3Btn"><source :src="audiosrc"/></audio>
                        <a href="javascript:;" class="voice"><Icon :type="volumeicon"></Icon></a>
                        <div class="voiceprogress"><Slider v-model="progress2" @on-change='voiceprogressplay' :step="10"></Slider></div>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="primary" @click='playrecord=false'>关闭</Button>
                </div>
            </Modal>
        </transition>


    </div>
</div>
    
</template>

<script>
    import $axios from '@/assets/js/axios';
    import {formatTime} from '@/assets/js/common.js'
    export default {
        data: function(){
            return {
                audiotime:null,
                audiosrc:'',
                duration:'00:00',
                currentTime:'00:00',
                stateicon:'play',
                volumeicon:'volume-medium',
                progress1:0,
                progress2:30,
                playrecord:false,
                loadingShow:false,
                clearinputicon:false,
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
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon:'ios-play',
                                    },
                                    'class':{
                                        btn1:true
                                    },
                                    on: {
                                        click: () => {
                                            this.playModal(params.index,params.row,params.column)
                                        }
                                    }
                                }),
                                h('p', {
                                    
                                    'class':{
                                        playtip:true
                                    },
                                    
                                },'播放录音'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon:'android-arrow-down',
                                        // disabled:params.row.record_filename==''?true:false
                                    },
                                    'class':{
                                        btn2:true
                                    },
                                    on: {
                                        click: () => {
                                            this.download(params.index,params.row,params.column)
                                        }
                                    }
                                }),
                                h('p', {
                                    
                                    'class':{
                                        downloadtip:true
                                    },
                                    
                                },'下载录音'),
                            ]);
                        }
                    }
                ],
                list: [],
                start_time:'',
                end_time:'',
                typevalue:null
            }
        },
        watch:{
            'searchvalue':function (newval,oldval) {
                (newval!='')?this.clearinputicon=true:this.clearinputicon=false;
            },
        },
        methods: {
            clearinput(){
                this.searchvalue=''
            },
            formatTime,
            //所有
            getCallRecord(config){
                var that=this;
                that.spinShow = true;
                $axios('/account/CallRecord/getCallRecord',{
                        first_id:(this.page-1)*this.pagesize,
                        count:this.pagesize,
                        search:this.searchvalue,
                        start_time:this.start_time,
                        end_time:this.end_time,
                        rid:this.typevalue
               },(response)=>{
                    if (response.data.data==null) {
                        that.spinShow = false;
                        that.list=[]
                        return
                    }
                    if (response.data.status==0) {
                        that.total=response.data.data.total;
                        that.list=response.data.data.content 
                    }else{
                        that.$Message.info(response.data.data);
                    }
                    that.spinShow = false;
               })
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
            
            //下载
            download(index,row){
                if (row.record_filename=='') {
                    this.$Message.error('坐席未录音');
                    return;
                }else{
                    var btn2=document.querySelectorAll('.btn2');
                    btn2[index].classList.add('btn-finish')
                    window.location.href=this.list[index].record_filename;
                    this.$Message.success('录音下载成功!');
                }    
            },
            playModal(index,row){
                // this.progress1=0;
                window.clearInterval(this.audiotime);
                if (row.record_filename=='') {
                    this.$Message.error('坐席未录音');
                    return;
                }else{
                    this.playrecord=true;
                    this.loadingShow=true;

                    var that=this
                    $axios('/account/Callrecord/DownloadVideo',{
                        id:row.id
                    },(response)=>{
                        if (response.status==200) {
                            that.loadingShow=false;
                            that.audiosrc='/account/Callrecord/DownloadVideo?id='+row.id;
                            that.stateicon='play';
                            that.currentTime='00:00'
                        };
                        
                    })

                    
                }     
            },
            play(){

                var audio = document.getElementById('mp3Btn');
                audio.volume = .3;

                this.duration=this.secondToMin(audio.duration);

                this.audiotime=setInterval(()=>{
                    this.currentTime=this.secondToMin(audio.currentTime);
                    this.progress1=audio.currentTime*100/audio.duration;
                    if (this.progress1==100) {
                        window.clearInterval(this.audiotime);
                        this.stateicon='play'
                    };
                },1000)
               
                if (audio.paused) {
                    audio.play(); //播放
                    this.stateicon='pause'
                    return;
                } else {
                    audio.pause(); 
                    this.stateicon='play';
                    window.clearInterval(this.autiotime);
                }
            },
            // 调节播放进度
            audioprogressplay(value){
                var audio = document.getElementById('mp3Btn');
                audio.currentTime = value/100 * audio.duration;
            },
            // 调节音量
            voiceprogressplay(value){
                var audio = document.getElementById('mp3Btn');
                audio.volume = value/100
                audio.volume==0?this.volumeicon='ios-volume-low':this.volumeicon='volume-medium'
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
            secondToMin(s) {
　　　　　　　　var MM = Math.floor(s / 60);
　　　　　　　　var SS = s % 60;
　　　　　　　　if(MM < 10){
                    MM = "0" + MM;
                }　　
　　　　　　　　if(SS < 10){
                    SS = "0" + SS;
                }　　
　　　　　　　　var min = MM + ":" + SS;
　　　　　　　　return min.split('.')[0];
            }
        },
        mounted(){
            var that=this;
            //获取分类
            $axios('/account/Customer/GetCallresult',{},(response)=>{
                if (response.data.data==null) {
                    that.category = [];
                    return
                }
                if (response.data.status==0) {
                    that.category=response.data.data
                    if (that.category.length>0) {
                            that.category.push({
                            cm_result:'未分类',
                            id:0
                        })
                    }
                    
                };
            })
            //获取record
            this.getCallRecord()
        }
    }
</script>
<style>
    .btn-finish{
        color: #00b5ff;
    }
    .btn-finish .ivu-icon-android-arrow-down:before{
        background-position: -81px -6px;
    }
    .btn-finish:after{
        content: '完成';
        position: absolute;
        margin-left: 3px;
    }
</style>
<style scoped>
    .audiobody{
        position: relative;
        height: 48px
    }
    .loadtext{
        margin-left: 10px;
        font-size: 16px
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
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
</style>