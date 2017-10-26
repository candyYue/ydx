<template>
    <div class="loginIn">
        <h1>手机号登录</h1>
        <p>欢迎回来</p>
            <div class="phone">
                <Input v-model="tel" placeholder="请输入手机号" style="width: 300px" @on-enter='next' 
                      :maxlength="11" @on-keyup="numberOnly"></Input>
                <img src="../../assets/images/login/cell.png" height="20" width="20" alt="">
                <span class="wrongTel">{{wrongTip}}</span>
            </div>
            <div class="login-btn">
                <Button type="info"  @click="next">下一步</Button>
            </div>
    </div>
</template>

<script>
    import {trim} from '@/assets/js/common.js';
    import $axios from '@/assets/js/axios';

    export default {
        data: function(){
            return {
                tel: '',
                wrongTip:""
            }
        },
        methods: {
            numberOnly(val){
                this.tel = this.tel.replace(/[^\d]/g,'')
            },
            next(){
                if (this.tel.trim()=='') {
                    this.wrongTip='请输入手机号'
                    return false;
                }else{
                    this.tel=trim(this.tel)
                    var r_this=this
                    $axios('/account/user/getBelongEps',{phone:r_this.tel},(response)=>{
                        var res=response.data
                        if (res.status==0) {
                            //存储手机号
                            if(!window.localStorage){
                                console.log("浏览器支持localstorage");
                                return false;
                            }else{
                                window.localStorage.setItem("phone",r_this.tel);
                                //对应一个企业
                                if (res.data.length==1) {  
                                    //企业到期时间
                                    var date=res.data[0].end_run_time+' 23:59:59';
                                    date = new Date(Date.parse(date.replace(/-/g, "/")));
                                    date = date.getTime(); //到期时间戳
                                    r_this.$store.state.endday=Math.floor((date/1000-res.time)/86400)


                                    window.localStorage.setItem("eid",res.data[0].id);
                                    window.localStorage.setItem("companyname",res.data[0].name); 
                                    // r_this.$router.push("/password") 
                                    r_this.$store.state.tel=false
                                    r_this.$store.state.password=true
                                    r_this.$store.state.company=false
                                    r_this.$store.state.findpassword=false
                                }else{
                                //对应多个企业
                                    // console.log(res.data);
                                    r_this.$store.state.company=res.data
                                    // r_this.$router.push("/company")

                                    r_this.$store.state.tel=false
                                    r_this.$store.state.password=false
                                    r_this.$store.state.company=true
                                    r_this.$store.state.findpassword=false
                                }
                            }
                            
                        };
                        if (res.status!==0) {
                            r_this.wrongTip=res.info
                        };
                    },'post')
                }
                
            },
        },
        mounted(){
        }
    }
</script>

<style scoped>
    .phone{
        position: relative;
    }
    
    .wrongTel{
        position: absolute;
        top: 32px;
        left: 85px;
        font-size:14px;
        color: #ff5e5e;
        line-height: 24px;
    }
    .phone img{
        position: absolute;
        left: 85px;
        bottom: 8px;
    }
</style>