<template>
	<div>
    	<div class="item1">
    	    <ul>
                <li class="start done"><div>1</div>上传文档<span></span></li>
    	        <li class="doing done"><div>2</div>导入数据<span></span></li>
    	        <li class="finish active"><div>3</div>导入完成</li>
    	    </ul>
    	    <Progress :percent="100" status="active"></Progress>
            <p>导入完成，共 {{$store.state.all}} 条，已成功 {{$store.state.already}} 条</p>
    	    <p v-if='errorReport'><a :href="'/account/Operator/getImportreport?hash_code=' + alink" class="downfailure">下载错误报告,</a>&nbsp;查看失败原因</p>
    	</div>
        <div slot="footer" class="ivu-modal-footer">
            <Button size="large" type="primary" @click="finish">完成</Button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data: function(){
            return {
                alink:'',
                errorReport:false
            }
        },
        methods:{
            finish(){
                this.$store.state.importseat=false
                this.$store.state.steponemark=true
                this.$store.state.steptwomark=false
                this.$store.state.stepthreemark=false
            }
        },
        mounted(){
             this.alink=this.$store.state.hash_code;
             if (this.$store.state.all>this.$store.state.already) {
                this.errorReport=true
             }else{
                this.errorReport=false
             }
        }
    }
</script>

<style scoped>
	/* @import "assets/css/importclient.css"; */
</style>
