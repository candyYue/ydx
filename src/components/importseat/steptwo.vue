<template>
	<div>
    	<div class="item1">
    	    <ul>
    	        <li class="start done"><div>1</div>上传文档<span></span></li>
    	        <li class="doing active"><div>2</div>导入数据</li>
    	        <li class="finish"><div>3</div>导入完成</li>
    	    </ul>
    	    <Progress :percent="percent" status="active"></Progress>
            <p>正在导入</p>
    	</div>
    	<!-- <div class="item4">
    	    <Button class="confirm">正在导入</Button>   
    	</div> -->
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                percent:0,
            }
        },
        methods:{

        },
        mounted(){
            var importtime=0
            var hashCode=this.$store.state.hash_code;
            var that=this
            this.$store.state.getper=setInterval(function () {

                importtime++;
                if (importtime>=120) {
                    clearInterval(that.$store.state.getper)
                    that.$store.state.steptwomark=false
                    that.$store.state.steponemark=true
                    that.$store.state.importclient=false
                    that.$Message.warning('导入失败，请重试');
                    importtime=0
                    return;
                };

                axios.get('/account/Operator/getPercent',{
                params:{
                    hash_code:hashCode,
                    type:'operator'
                }
                })
                .then(function (response) {
                    that.percent=response.data.data.per
                    if (response.data.data.per==100) {

                        clearInterval(that.$store.state.getper)
                        that.$store.state.steptwomark=false
                        that.$store.state.stepthreemark=true
                        that.$store.state.all=response.data.data.result.total
                        that.$store.state.already=response.data.data.result.success


                        axios.get('/account/Operator/getAllmembers',{
                            params:{
                                first_id:0,
                                count:20,
                                type:0
                            }
                        })
                        .then(function (response) {
                            if (response.data.status==0) {
                                that.$store.state.seattotal=response.data.data.total;
                                that.$store.state.seatlist=response.data.data.content;
                            };
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    };
                })
                .catch(function (error) {
                    console.log(error);
                });
            },1000)
        }
    }
</script>

<style scoped>
	/* @import "assets/css/importclient.css"; */
</style>
