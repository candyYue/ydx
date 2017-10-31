<template>
    <div>
        <h3>坐席统计</h3>
        <div class="temp">
            <!-- 选择日期 -->
            <div class="time clearfix handle2">
                <div class="fl">
                    <DatePicker type="date" placeholder="选择日期" @on-change='startT' :options="options3"></DatePicker>
                     至
                    <DatePicker type="date" placeholder="选择日期" @on-change='endT' :options="options3"></DatePicker>
                    <Button @click='searchdate'>搜索</Button>
                </div>
                <div class="fr">
                    <Input v-model="sname" placeholder="请输入姓名进行搜索" style="width: 280px" @on-enter='searchAction' icon="ios-search-strong"></Input>
                    <!-- <i class='searchicon_small'></i> -->
                    <Button  class="searchicon" @click="searchAction">搜索</Button>  
                    <Button @click="exportData"><Icon :type="exporticon"></Icon>导出</Button>
                </div>
            </div>
            <!-- 坐席管理 -->
            <div class="tableContent">
                <Table :columns="columns" border :data="list" ref="table"  size="small"></Table>
                
                <div class="page clearfix">
                    <Page :total="total" :page-size="pagesize" show-sizer :page-size-opts="[20, 50, 100]" @on-page-size-change="    changepagesize" @on-change="changepage"></Page>
                </div>
            </div>
        
        </div>
        <div class="spin" v-if="spinShow">
            <Spin size="large" fix></Spin>
        </div>
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    import {formatTime} from '@/assets/js/common.js'

    export default {
        data () {
            return {
                // 保留前18个月
                options3: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000*18*30;
                    }
                },
                spinShow:true,
                ExportOperatorhashcode:'',
                tableheight:0,
                exporticon:'reply',
                start_time:'',
                end_time:'',
                pagesize:20,  //每页条数
                page:1,      //页数
                total:0,
                sname:"",
                columns: [
                    {
                        "title": "坐席",
                        "key": "name"
                    },
                    {
                        "title": "呼叫次数",
                        "key": "outcall_total_count",
                        "sortable": true
                    },
                    {
                        "title": "接听次数",
                        "key": "outcall_count",
                        "sortable": true
                    },
                    {
                        "title": "接听率",
                        "key": "outcall_rate",
                        "sortable": true,
                         render: (h, params) => {

                            return h('div',Number(params.row.outcall_rate).toFixed(2)+'%');  
                        }
                    },
                    {
                        "title": "通话时长",
                        "key": "outcall_time",
                        "sortable": true,
                        render: (h, params) => {

                            return h('div',this.time(params.row.outcall_time));  
                        }
                    }
                ],
                list: [],
                data1:0,
                data2:0
            }
        },
        methods:{
            time:formatTime,
            //日期搜索
            startT(a){
                this.start_time=a
                this.date1 = new Date(Date.parse(a.replace(/-/g, "/")));
                this.date1 = this.date1.getTime(); 
                console.log(this.date1)
            },
            endT(b){
                this.end_time=b
                this.date2 = new Date(Date.parse(b.replace(/-/g, "/")));
                this.date2 = this.date2.getTime(); 
                console.log(this.date2)
            },
            searchdate(){
                if (this.date2-this.date1<0) {
                    this.$Message.info('开始时间不能高于结束时间');
                    return;
                };
                this.page=1
                var that=this

                this.getOperatorsStatistic('/account/CallRecord/getOperatorStatistic',{
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        start_time:this.start_time,
                        end_time:this.end_time
                    }
                })
            },
            //模糊匹配
            searchAction(){
                this.page=1
                this.initstatistic()
            },

            //进入获取所有坐席信息
            getOperatorsStatistic(url,config){
                var that=this
                that.spinShow = true;
                $axios(url,config,(response)=>{
                    if (response.data.data==null) {
                        that.list=[];
                        that.spinShow = false;
                        return
                    };
                    if (response.data.status==0) {
                        that.total=response.data.data.total;
                        // that.list=response.data.data.content
                        let newList=[];
                        response.data.data.content.map((item,index)=>{
                          newList[index] = {}
                          for(var prop in item){
                            if(prop=='name'){
                              newList[index][prop] = item[prop]
                            }else{
                              newList[index][prop] = Number(item[prop])
                            }
                          }
                        })
                        that.list = newList;
                    };
                    that.spinShow = false;
                })
            },
            initstatistic(){
                var that=this;
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                    params:{
                        first_id:(that.page-1)*that.pagesize,
                        count:that.pagesize,
                        search:that.sname
                    } 
                })
            },
            //每页多少条
            changepagesize(index){
                this.pagesize=index;
                var that=this;
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    } 
               })

            },
            //切换页数
            changepage(index){
                this.page=index;
                var that=this;
                this.getOperatorsStatistic('account/CallRecord/getOperatorStatistic',{
                params:{
                    first_id:(that.page-1)*that.pagesize,
                    count:that.pagesize
                    }
               })
            },
            //导出csv
            exportData(){
                window.location.href='/account/Operator/ExportStatistic'
                this.$Message.success('导出成功！');
            }
        },
        mounted () {
            this.initstatistic()
  　　  }
    }
</script>

<style scoped>
        .time{
            margin: 10px 0 20px;
            position: relative;
        }
        .fl div{
            display: inline-block;
        }
        /* 导出按钮 */
        .ivu-btn{
            color: #fff;
            background-color: #00b5ff;
        }
        .ivu-btn i{
            margin-right: 8px
            
        }
        .ivu-btn .ivu-icon{
            color: #fff
        }
</style>