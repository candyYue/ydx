<template>
    <div>
        <div class="loginIn">
            <h1>选择企业</h1>
            <p>欢迎回来</p>
                <div class="company">
                         <Select v-model="model" style="width:300px" @on-change="getcid" placeholder='请选择企业'>
                            <Option v-for="(item,index) in company" :value="index" ref="button" :key="index">{{item.name}}</Option>
                        </Select>
                        <!-- <button v-for="(item,index) in company" :value="index" @click="getcid(index)" ref="button">{{item.name}}</button> -->
                    <span class="wrongTel">{{wrongTip}}</span>
                </div>
                <div class="login-btn">
                     <Button type="info"  @click="next">下一步</Button>
                </div>
        </div>
    </div>
</template>

<script>
    import $axios from '@/assets/js/axios';
    export default {
        data () {
            return {
                company:[],
                choose:-1,
                wrongTip:'',
                model: "",
                nowdate:'' //当前时间戳
            }
        },
        methods: {
            getcid(index){
                // console.log(this.company[index])
                var date=this.company[index].end_run_time+' 23:59:59';
                
                date = new Date(Date.parse(date.replace(/-/g, "/")));
                date = date.getTime(); //到期时间戳

                // 截止到期时间
                this.$store.state.endday=Math.floor((date/1000-this.nowdate)/86400)

                window.localStorage.setItem("eid",this.company[index].id); 
                window.localStorage.setItem("companyname",this.company[index].name); 
                this.choose=index;  
            },
            next(){
                var button=this.$refs.button;
                if (this.choose>-1) {
                    this.wrongTip=''
                    // this.$router.push("./password")
                    this.$store.state.tel=false
                    this.$store.state.password=true
                    this.$store.state.company=false
                    this.$store.state.findpassword=false
                }else{
                    this.wrongTip='请选择企业'
                }
            }
        },
        mounted(){
            var r_this=this
                var phone=window.localStorage.getItem("phone")
                $axios('/account/user/getBelongEps',{phone:phone},(response)=>{
                    r_this.nowdate=response.data.time
                    r_this.company=response.data.data
                },'post')

                if(this.$store.state.eid){
                    this.$store.state.tel=false
                    this.$store.state.password=true
                    this.$store.state.company=false
                    this.$store.state.findpassword=false
                }
        }
    }
</script>

<style scoped>
    .company{
        position: relative;
    }
    .company button{
        width: 300px;
        height: 42px;
        border: 1px solid #d8d8d8;
        border-radius: 2px;
        cursor: pointer;
    }
    .company button:nth-of-type(2){
        margin:12px 0; 
    }
    .onfocus{
        background-color: #03a9f4;
        color: #fff;
    }
    .wrongTel{
        position: absolute;
        bottom: -30px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
</style>