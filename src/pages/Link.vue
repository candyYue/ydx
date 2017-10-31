<template>
    <div>
        <h3>线索池</h3>
        <div class="temp">
            <ul class="link clearfix">
                <li class='linktab'><router-link to="/link">线索池</router-link></li>
                <li class='linktab'><router-link to="/phoneresult">通话结果管理</router-link></li>
            </ul>
            <router-view></router-view>
        </div>
    </div>
    
</template>

<script>
    export default {
        data() {
            return {

            }
        },

        methods: {
        }
    }
</script>

<style scoped>

    .link{
        margin:40px 0 20px;
        border-bottom: 1px solid #ccc;
    }
    .link .linktab{
        float: left;
        margin-bottom: -1px;
    }
    .link .linktab:nth-of-type(1){
        margin-left: 10px;
    }
    a{
        display: inline-block;
        line-height: 46px;
        height: 46px;
        padding: 0 20px;
        border: 1px solid #ccc;
        /* border-bottom: none; */
        background-color: #f4f4f4;
        font-size: 16px;
        color: #333;
    }
    .linktab:nth-of-type(1) a{
        border-right: none;
    }
    .router-link-active {
        background-color: #fff;
        border-top: 3px solid #00b5ff;
        border-bottom: 1px solid #fff
    }
</style>
