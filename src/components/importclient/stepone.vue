<template>
	<div>
    	<div class="item1">
    	    <ul>
    	        <li class="start active"><div>1</div>上传文档</li>
    	        <li class="doing"><div>2</div>导入数据</li>
    	        <li class="finish"><div>3</div>导入完成</li>
    	    </ul>
    	    <p>一、请按照数据模板的格式准备要导入的数据，<a href="/downloads/customer_templets.xlsx" class="downtemp">下载导入模板</a></p>
    	    <p>二、准备要导入的csv文件</p>
            <Upload action="/account/Customer/importCustomer" name="ccsv" class="file" :show-upload-list=false :on-success="handleSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                <span class="uptip" v-if='wronguptip'>{{uptip}}</span>
                <span class="uptip2" v-if='!wronguptip'>{{uptip}}</span>
            </Upload>
    	</div>
    	<div slot="footer" class="ivu-modal-footer">
			<Button type="primary" size="large" @click="startimport">开始导入</Button>
    	    <Button size="large" @click="$store.state.importclient=false">取消</Button>
    	</div>
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    export default {
        data: function(){
            return {
                wronguptip:true,
                uptip:'',
                upres:null
            }
        },
        // props:["message"],
        methods:{
            //文件上传成功返回hash_code
            handleSuccess (res, file) {
                this.upres=res
                if (res.status==0) {
                    this.wronguptip=false;
                    this.uptip="csv文件上传成功";
                    this.$store.state.hash_code=res.data.hash_code
                }else{
                    this.wronguptip=true;
                    this.uptip=res.info;
                }

                // console.log(file)
            },
            startimport(){
                if (this.upres==null) {
                    this.wronguptip=true;
                    this.$Message.error('请先选择需要导入的文件');
                    return;
                }
                var that=this
                var hashCode=this.$store.state.hash_code
                $axios('/account/Customer/getPercent',{
                        hash_code:hashCode,
                        type:'customer'
                },(response)=>{
                    if(response.data.status===0){
                         that.$store.state.steponemark=false
                         that.$store.state.steptwomark=true
                    }
                })
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
	/* @import "assets/css/importclient.css"; */
</style>
