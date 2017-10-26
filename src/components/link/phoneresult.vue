<template>
    <div class="clearfix">
        <div class="phoneresult" v-for="(item, index) in category" v-if="category.length">
            <img src="../../assets/images/editphoneresult.gif" alt="">
            <p>{{item.cm_result}}</p>
            <div>
                <Button type="primary" @click='editmark(index)'>编辑</Button>
                <Button  @click='removemark(index)'>删除</Button>
            </div>
        </div>
        <a class="phoneresult newphoneresult" @click="addlimite">
            <!-- <i>+</i> -->
            <Icon type="ios-plus-empty"></Icon>
            <p>新建分类</p>
        </a>

        <!-- 分类弹框 -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="classifyModal" v-model="classifyModal" :title="classifyTitle" class="classify-modal" :mask-closable="false">
            <a slot="close" @click="cancel"><Icon type="ios-close-empty"></Icon></a>
            <Form :label-width="122" @submit.native.prevent>
              <FormItem label="结果分类名称：">
                 <Input v-for="item in newClassify" :key="item.key" v-model="item.name"  @on-enter='classifyAction'/>
                 <div @click="addinput" ><Icon type="ios-plus-outline" class="add-input-btn" v-if="addBtn"></Icon></div>
                 <!-- <Button shape="circle" icon="android-add" @click="addinput" class="add-input-btn" v-if="addBtn"></Button> -->
             </FormItem>
            </Form>
            <div class="error">
                <p>{{tip}}</p>
            </div>
            <div slot="footer">
              <Button type="primary" size="large" @click="classifyAction">确定</Button>
              <Button size="large" @click="cancel">取消</Button>
            </div>
          </Modal>
        </transition>

        <!-- 删除弹框 -->
        <transition enter-active-class="animated fadeIn">
          <Modal v-if="removebox" v-model="removebox" title="删除分类" :mask-closable="false">
            <a slot="close" @click="cancel"><Icon type="ios-close-empty"></Icon></a>
            删除后，该分类将被删除，分类下的客户将被移至未分类
            <div slot="footer">
              <Button type="primary" size="large" @click="removecategroy">确定</Button>
              <Button size="large" @click="cancel">取消</Button>
            </div>
          </Modal>
        </transition>
    </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                // 分类弹框
                classifyModal:false,
                classifyTitle:"新建分类",
                addBtn:true,    // 创建分类的加号

                // newClassifyLen:1,
                newClassify:[{key:0,name:""}],
                classifyAction:()=>{},
                removebox:false,
                select:-1,
                type:'',
                addtype:[],
                category:[],
                inputs:[],
                tip:''
            }
        },
        methods: {
            cancel(){
              this.classifyModal=false
              this.newClassify=[{key:0,name:""}]
              this.removebox=false;
              this.tip=''
            },
            addinput(){
              console.log(1)
                var all=this.category.length+this.newClassify.length
                if (all<10) {
                  this.newClassify.push({key:this.newClassify.length,name:""})
                }else{
                    this.$Message.warning('通话结果最多只能有10个分类');
                    return;
                }
            },
            addlimite(){

                if (this.category.length<=9) {
                    this.classifyModal=true
                    this.classifyTitle="新建分类"
                    this.addBtn = true
                    this.classifyAction = this.addcategroy
                }else{
                    this.$Message.warning('通话结果最多只能有10个分类');
                }
            },
            addcategroy(){
                const that = this;
                let categroy_name = this.newClassify.map(item=>{
                  return item.name
                })
                for (var i = 0; i < categroy_name.length; i++) {
                  if (categroy_name[i].trim()=='') {
                      this.tip='请输入分类名称'
                      return;
                  };
                };
                categroy_name.length===1 ? categroy_name=categroy_name.toString() : categroy_name=JSON.stringify(categroy_name);
                axios.get('/account/Customer/addCallResult',{params: { categroy_name}})
                      .then(function(response){
                          if (response.data.status==0) {
                              that.getresult();
                              that.cancel();
                          }else{
                              that.tip=response.data.info
                          }

                      })
                      .catch(function(err){
                          console.log(err);
                      });
            },
            //删除
            removemark(index){
                this.removebox=true
                this.select=index
            },
            removecategroy(){
                var that=this;
                axios.get('/account/Customer/deleteCallResult',{
                    params: {
                        rid:that.category[that.select].id,
                    }
                })
                .then(function(response){
                    if(response.data.status==0){
                      that.getresult()
                      that.cancel()
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
            },
            editmark(index){
                this.classifyTitle ="编辑分类"
                this.classifyModal=true
                this.addBtn = false
                this.classifyAction = this.editcategroy;
                this.select=index;
                this.newClassify=[{key:this.select,name:this.category[index].cm_result}]
            },
            editcategroy(){
                if (this.newClassify[0].name.trim()=='') {
                      this.tip='请输入分类名称'
                      return;
                };
                var that=this;
                var config = {
                  rid:that.category[that.select].id,
                  categroy_name:that.newClassify[0].name
                }
                axios.get('/account/Customer/modifyCallResult',{ params: config})
                .then(function(response){
                    if(response.data.status==0){
                      that.getresult();
                      that.cancel();
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
            },
            getresult(){
                var that=this;
                axios.get('/account/Customer/GetCallresult')
                .then(function(response){
                    console.log(response);
                    if (response.data.status==0) {
                       if(!response.data.data){
                         that.category = []
                         return;
                       }
                       that.category=response.data.data;
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
            },
        },

        mounted(){
            this.getresult()
        }
    }
</script>

<style scoped>
    /* 通话结果卡片 */
    .phoneresult{
        width: 198px;
        height: 136px;
        border-radius: 2px;
        border: 1px solid #e6e6e6;
        margin-right: 14px;
        margin-bottom: 14px;
        float: left;
        text-align: center;
        padding: 14px 0;
        position: relative;
        transition: all linear .35s;
    }
    .phoneresult:hover{
      box-shadow: 0 0 12px rgba(0,0,0,.12);

    }
    .phoneresult p{
        margin: 5px 0 10px;
        cursor: pointer;
        height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .phoneresult img{
        width: 38px;
    }
    .phoneresult .ivu-btn{
        width: 60px;
        height: 26px;
        padding:0;
    }
    /* 新建分类卡片 */
    .newphoneresult{
      color: #666;
      border-color: #ccc;
      background-color: #f4f4f4;
    }
    .newphoneresult i{
      font-size: 60px;
      line-height: 1;
      transition: all linear .35s;
    }
    .newphoneresult:hover{
      background-color: #fff;
    }
    .newphoneresult:hover>i{
      color: #00b5ff
    }
    .newphoneresult:hover>p{
      color: #333
    }
    /* 弹框 */
    .ivu-form-item{
        margin-right: 50px;
    }
    .ivu-input-wrapper{
      margin-bottom: 12px;
    }
    .add-input-btn{
      font-size: 36px;
      color: #999;
      cursor: pointer;
      position: absolute;
      right:-40px;
      top: 0;
      transition:all 0.2s;
    }
    .add-input-btn:hover{
        color: #00b5ff;
    }
</style>
